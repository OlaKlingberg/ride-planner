import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

import { AlertService } from '../../alert/alert.service';
import { Cue } from '../cue';
import { Cuesheet } from '../cuesheet';
import { CuesheetDemoService } from '../cuesheet-demo.service';
import { cuesheetEditAnimations } from './cuesheet-edit.component.animations'

@Component({
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: cuesheetEditAnimations
})
export class CuesheetEditDemoComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('demoModeModal') demoModeModal: TemplateRef<any>;

  constructor(private alertService: AlertService,
              private cuesheetDemoService: CuesheetDemoService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('id');

    this.checkForModalClose();
    this.getCuesheet(this.cuesheetId);

    this.modalRef = this.modalService.show(this.demoModeModal);
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
    let cue = new Cue(this.cueModel);

    if ( this.cueToInsertBefore !== null ) {
      // The cue was inserted in the middle of cuesheet.
      this.fadeOutTr($('#insert-form-row'));

      setTimeout(() => {
        this.cuesheet.cues.splice(this.cueToInsertBefore, 0, cue);
        this.cuesheet = this.setTotalDistances(this.cuesheet);
        this.cueToInsertBefore = null;

        this.cuesheetDemoService.updateCuesheet(this.cuesheet);

        setTimeout(() => {
          this.slideDownTr($('#cue-form-row'));
        }, 0);
      }, 200);
    } else {
      // The cue was added to the end of the cuesheet.
      this.fadeOutTr($('#insert-form-row'));

      this.total += this.cueModel.distance;
      cue.total = this.total;
      cue.state = 'display';
      this.cuesheet.cues.push(cue);

      this.cuesheetDemoService.updateCuesheet(this.cuesheet);
    }
  }

  deleteCue() {
    this.cuesheet.cues[ this.cueToDelete ].state = 'removed'; // Removes the insert and delete buttons, before running the animation that removes the table row.
    setTimeout(() => {
      this.cuesheet.cues.splice(this.cueToDelete, 1);
      this.cueToDelete = null;
      // this.focusTrigger.emit(true);
      this.cuesheetDemoService.updateCuesheet(this.cuesheet);
    }, 300);
  }

  deleteCuesheet() {
    this.cuesheetDemoService.deleteCuesheet(this.cuesheet._id);

    this.alertService.success(`The cue sheet ${this.cuesheet.name} has been deleted.`);
    this.router.navigate([ '/cuesheet' ]);

  }

  displayCuesheet(cuesheet) {
    this.cuesheetModel.cuesheetName = cuesheet.name;
    this.cuesheetModel.cuesheetDescription = cuesheet.description;
    this.cuesheet = this.setTotalDistances(cuesheet);

    if ( this.cuesheet.cues.length === 0 ) {
      this.cueModel.distance = '0';
      this.cueModel.turn = 'Start';
    }
  }

  editCue(i, shouldAct) {
    if ( shouldAct ) {
      this.slideUpTr($('#cue-form-row'));

      setTimeout(() => {
        this.cueModel.distance = this.cuesheet.cues[ i ].distance / 100;
        this.cueModel.turn = this.cuesheet.cues[ i ].turn;
        this.cueModel.description = this.cuesheet.cues[ i ].description;

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

  getCuesheet(cuesheetId) {
    this.cuesheetDemoService.getCuesheet(cuesheetId)
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
          // this.focusTrigger.emit(true);
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
    const cue = new Cue(this.cueModel);

    this.fadeOutTr($('#insert-form-row'));

    setTimeout(() => {
      this.cuesheet.cues.splice(this.cueToEdit, 1, cue);
      this.cuesheet = this.setTotalDistances(this.cuesheet);
      this.cueToEdit = null;
      setTimeout(() => {
        this.slideDownTr($('#cue-form-row'));
      }, 0);

      this.cuesheetDemoService.updateCuesheet(this.cuesheet);
    }, 200);
  }

  updateCuesheet() {
    this.cuesheet.name = this.cuesheetModel.cuesheetName;
    this.cuesheet.description = this.cuesheetModel.cuesheetDescription;
    this.cuesheetDemoService.updateCuesheet(this.cuesheet);
    this.hideInputFields();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
