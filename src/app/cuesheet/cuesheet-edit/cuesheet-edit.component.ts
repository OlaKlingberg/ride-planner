import { Component, EventEmitter, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuesheetService } from '../cuesheet.service';
import { Cuesheet } from '../cuesheet';
import { Cue } from '../cue';
import * as $ from 'jquery';

import { AlertService } from '../../alert/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { cuesheetEditAnimations } from './cuesheet-edit.component.animations'
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: cuesheetEditAnimations
})
export class CuesheetEditComponent implements OnInit, AfterViewInit {
  public cuesheet: Cuesheet;
  public cueModel: any = {};
  public cuesheetModel: any = {};
  public total: number = 0;
  private cuesheetId: string = '';

  private cueToDelete: number = null;
  public cueToEdit: number = null;
  public cueToInsertBefore: number = null;

  public cuesheetNameInput: boolean = false;
  public cuesheetDescriptionInput: boolean = false;
  public focusTrigger = new EventEmitter<boolean>();
  public modalRef: BsModalRef;

  @ViewChild('cueForm') cueForm: NgForm;

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService,
              private alertService: AlertService,
              private router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('id');

    this.checkForModalClose();
    this.getCuesheet(this.cuesheetId);
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  checkForModalClose() {
    this.modalService.onHide.subscribe((reason: string) => {
      this.cueToDelete = null;
    });
  }

  getCuesheet(cuesheetId) {
    this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.cuesheetModel.cuesheetName = cuesheet.name;
          this.cuesheetModel.cuesheetDescription = cuesheet.description;
          this.cuesheet = this.setTotalDistances(cuesheet);

          if ( this.cuesheet.cues.length === 0 ) {
            this.cueModel.distance = '0';
            this.cueModel.turn = 'Start';
          }
        });
  }

  // Todo: Seems like an ugly solution. Isn't there a better way?
  setTotalDistances(cuesheet) {
    this.total = 0;
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
      cue.state = 'display';  // Used for animation.
      return cue;
    });

    return cuesheet;
  }

  editCuesheetName() {
    this.cuesheetNameInput = true;
    this.cuesheetDescriptionInput = false;
  }

  editCuesheetDescription() {
    this.cuesheetNameInput = false;
    this.cuesheetDescriptionInput = true;
  }

  hideInputFields() {
    this.cuesheetNameInput = false;
    this.cuesheetDescriptionInput = false;
  }

  cancelCuesheetUpdate() {
    this.cuesheetModel.cuesheetName = this.cuesheet.name;
    this.cuesheetModel.cuesheetDescription = this.cuesheet.description;
    this.hideInputFields();
  }

  updateCuesheet() {
    this.cuesheetService.updateCuesheet(this.cuesheetId, {
      name: this.cuesheetModel.cuesheetName,
      description: this.cuesheetModel.cuesheetDescription
    }).then(cuesheet => {
      this.cuesheet.name = cuesheet.name;
      this.cuesheet.description = cuesheet.description;
      this.hideInputFields();
    })
  }

  saveCue($event) {
    if ( ($event && $event.keyCode === 13 ) || $event === 'saveCueButton' ) {
      this.cueModel.distance = Math.round(this.cueModel.distance * 100);

      if ( this.cueToEdit === null ) {
        this.createCue();
      } else {
        this.updateCue();
      }

      this.cueForm.reset();
      this.focusTrigger.emit(true);
    }
  }

  updateCue() {
    this.cuesheetService.updateCue(this.cuesheet.cues[ this.cueToEdit ]._id.toString(), this.cueModel)
        .then((cue: Cue) => {

          if ( !cue ) return; // Safety precaution.

          this.fadeOutTr($('#insert-form-row'));

          setTimeout(() => {
            this.cuesheet.cues.splice(this.cueToEdit, 1, cue);
            this.cuesheet = this.setTotalDistances(this.cuesheet);
            this.cueToEdit = null;
            setTimeout(() => {
              this.slideDownTr($('#cue-form-row'));
            }, 0);
          }, 200);




        });
  }

  createCue() {
    const cueToInsertBeforeId = this.cueToInsertBefore ? this.cuesheet.cues[ this.cueToInsertBefore ]._id : null;

    this.cuesheetService.createCue(this.cuesheet._id, this.cueModel, cueToInsertBeforeId).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      if ( this.cueToInsertBefore !== null ) {
        // The cue was inserted in the middle of cuesheet. Get the updated cuesheet.
        this.fadeOutTr($('#insert-form-row'));

        setTimeout(() => {
          this.cuesheet.cues.splice(this.cueToInsertBefore, 0, cue);
          this.cuesheet = this.setTotalDistances(this.cuesheet);
          this.cueToInsertBefore = null;

          setTimeout(() => {
            this.slideDownTr($('#cue-form-row'));
          }, 0);
        }, 200);
      } else {
        // The cue was added to the end of the cuesheet. Push the returned cue onto cuesheet.cues.
        this.fadeOutTr($('#insert-form-row'));

        this.total += cue.distance;
        cue.total = this.total;
        cue.state = 'display';
        this.cuesheet.cues.push(cue);
      }
    });
  }

  openCueDeletionModal(template: TemplateRef<any>, i: number, shouldAct: boolean) {
    if ( shouldAct ) {
      this.cueToDelete = i;
      this.modalRef = this.modalService.show(template);
    }
  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
      this.cuesheet.cues[ this.cueToDelete ].state = 'removed'; // Removes the insert and delete buttons, before running the animation that removes the table row.
      setTimeout(() => {
        this.cuesheet.cues.splice(this.cueToDelete, 1);
        this.cueToDelete = null;
        this.focusTrigger.emit(true);
      }, 300);
    });
  }

  insertCue(i, shouldAct: boolean) {
    if ( shouldAct ) {
      this.slideUpTr($('#cue-form-row'));
      setTimeout(() => {
        this.cueToInsertBefore = i;
        setTimeout(() => {
          this.slideDownTr($('#insert-form-row'));
          this.focusTrigger.emit(true);
        }, 0);
      }, 350);
    }
  }

  slideDownTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: none;" />')
        .parent()
        .find('td > div')
        .slideDown(300, () => {
          this.focusTrigger.emit(true);
          // Todo: Figure out what the two lines below are for. The don't seem to be needed, and they throw an error.
          // const $set = $(this);
          // $set.replaceWith($set.contents());
        });
  }

  slideUpTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: block;" />')
        .parent()
        .find('td > div')
        .slideUp(300, () => {
          $(this).parent().parent().remove();
        });
  }

  fadeInTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: none;" />')
        .parent()
        .find('td > div')
        .fadeIn(200, () => {

          // Todo: Figure out what the two lines below are for.
          // const $set = $(this);
          // $set.replaceWith($set.contents());
        });
  }

  fadeOutTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: block;" />')
        .parent()
        .find('td > div')
        .fadeOut(200, () => {
          $(this).parent().parent().remove();
        });
  }

  cancelCue() {
    if ( this.cueToInsertBefore !== null ) {
      this.slideUpTr($('#insert-form-row'));

      setTimeout(() => {
        this.cueToInsertBefore = null;

        setTimeout(() => {
          this.slideDownTr($('#cue-form-row'));
          // this.focusTrigger.emit(true);
        }, 0);
      }, 350);
    } else {
      this.fadeOutTr($('#insert-form-row'));

      setTimeout(() => {
        this.cueToEdit = null;

        setTimeout(() => {
          this.slideDownTr($('#cue-form-row'));
        }, 0);
      }, 200);
    }
  }


  editCue(i, shouldAct) {
    if ( shouldAct ) {
      this.slideUpTr($('#cue-form-row'));

      setTimeout(() => {
        this.cueModel.distance = this.cuesheet.cues[ i ].distance / 100;
        this.cueModel.turn = this.cuesheet.cues[ i ].turn;
        this.cueModel.description = this.cuesheet.cues[ i ].description;

        // this.cueToInsertBefore = null;
        this.cueToEdit = i;

        setTimeout(() => {
          this.fadeInTr($('#insert-form-row'));
        }, 0);
      }, 350);
    }
  }

  openCuesheetDeletionModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    console.log("modalRef:", this.modalRef);
  }

  deleteCuesheet() {
    this.cuesheetService.deleteCuesheet(this.cuesheet._id).then((cuesheet: Cuesheet) => {
      if ( cuesheet ) {
        this.alertService.success(`The cue sheet ${cuesheet.name} has been deleted.`);
        this.router.navigate([ '/cuesheet' ]);
      } else {
        this.alertService.error("Oops! Something went wrong!");
      }
    });
  }

  onKeyup($event) {
    console.log("onKeyup. $event:", $event.keyCode);
  }

  // Todo: Do I need this here? I do need it on the login-form.
  syncModel() {

  }


}
