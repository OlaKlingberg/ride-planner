import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

import { AlertService } from '../../alert/alert.service';
import { Cue } from '../cue';
import { Cuesheet } from '../cuesheet';
import { cuesheetEditAnimations } from './cuesheet-edit.component.animations'
import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: cuesheetEditAnimations
})
export class CuesheetEditComponent implements OnInit, AfterViewInit, OnDestroy {
  cueModel: any = {};
  cuesheet: Cuesheet;
  cuesheetDescriptionInput: boolean = false;
  cuesheetId: string = '';
  cuesheetModel: any = {};
  cuesheetNameInput: boolean = false;
  cueToDelete: number = null;
  cueToEdit: number = null;
  cueToInsertBefore: number = null;
  focusTrigger = new EventEmitter<boolean>();
  modalRef: BsModalRef;
  total: number = 0;

  private subscription: Subscription;

  @ViewChild('cueForm') cueForm: NgForm;

  constructor(private alertService: AlertService,
              private cuesheetService: CuesheetService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('id');

    this.checkForModalClose();
    this.getCuesheet(this.cuesheetId);

    // if (this.settingsService.demoMode ) this.modalRef = this.modalService.show(this.demoModeModal);
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
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

  cancelCuesheetUpdate() {
    this.cuesheetModel.cuesheetName = this.cuesheet.name;
    this.cuesheetModel.cuesheetDescription = this.cuesheet.description;
    this.hideInputFields();
  }

  checkForModalClose() {
    this.subscription = this.modalService.onHide.subscribe((reason: string) => {
      this.cueToDelete = null;
    });
  }

  createCue() {
    const cueToInsertBeforeId = this.cueToInsertBefore ? this.cuesheet.cues[ this.cueToInsertBefore ]._id : null;

    this.cuesheetService.createCue(this.cuesheet._id, this.cueModel, cueToInsertBeforeId).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      if ( this.cueToInsertBefore !== null ) {
        // The cue was inserted in the middle of cuesheet.
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
        // The cue was added to the end of the cuesheet.
        this.fadeOutTr($('#insert-form-row'));

        this.total += cue.distance;
        cue.total = this.total;
        cue.state = 'display';
        this.cuesheet.cues.push(cue);
      }
    });
  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
      this.cuesheet.cues[ this.cueToDelete ].state = 'removed'; // Removes the insert and delete buttons, before running the animation that removes the table row.
      setTimeout(() => {
        this.cuesheet.cues.splice(this.cueToDelete, 1);
        this.cueToDelete = null;
        // this.focusTrigger.emit(true);
        this.setTotalDistances(this.cuesheet);
      }, 300);
    });
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

  editCuesheetName(shouldAct: boolean) {
    if ( shouldAct ) {
      this.cuesheetNameInput = true;
      this.cuesheetDescriptionInput = false;
    }
  }

  editCuesheetDescription(shouldAct: boolean) {
    if ( shouldAct ) {
      this.cuesheetNameInput = false;
      this.cuesheetDescriptionInput = true;
    }
  }

  fadeInTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: none;" />')
        .parent()
        .find('td > div')
        .fadeIn(200, () => {

          // Todo: Figure out what the two lines below are for. The don't seem to be needed, and they throw an error.
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

  getCuesheet(cuesheetId) {
    this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.cuesheetModel.cuesheetName = cuesheet.name;
          this.cuesheetModel.cuesheetDescription = cuesheet.description;
          this.cuesheet = this.setTotalDistances(cuesheet);

          setTimeout(() => {
            if ( this.cuesheet.cues.length === 0 ) {
              this.cueModel.distance = '0';
              this.cueModel.turn = 'Start';
            }
          }, 100) // Todo: Figure out why cueModel.turn is reset to null unless I set a delay here.

        });
  }

  hideInputFields() {
    this.cuesheetNameInput = false;
    this.cuesheetDescriptionInput = false;
  }

  insertCue(i, shouldAct: boolean) {
    if ( shouldAct ) {
      this.slideUpTr($('#cue-form-row'));
      setTimeout(() => {
        this.cueToInsertBefore = i;
        setTimeout(() => {
          this.slideDownTr($('#insert-form-row'));
          // this.focusTrigger.emit(true);
        }, 0);
      }, 350);
    }
  }

  openCueDeletionModal(template: TemplateRef<any>, i: number, shouldAct: boolean) {
    if ( shouldAct ) {
      this.cueToDelete = i;
      this.modalRef = this.modalService.show(template);
    }
  }

  openCuesheetDeletionModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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

  slideDownTr(tr) {
    tr.find('td')
        .wrapInner('<div style="display: none;" />')
        .parent()
        .find('td > div')
        .slideDown(300, () => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
