import {
  AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, AfterViewInit,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';
import { Cuesheet } from '../_models/cuesheet';
import { Cue } from '../_models/cue';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { AlertService } from '../_services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { cuesheetEditAnimations } from './cuesheet-edit.component.animations'

@Component({
  selector: 'rp-cuesheet-edit',
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: cuesheetEditAnimations
})
export class CuesheetEditComponent implements OnInit, AfterViewInit {
  public cuesheet: Cuesheet;
  public cueModel: any = {};
  public cuesheetModel: any = {};
  public total: number = 0;
  public insertBeforeCueId: string = '';
  public insertBeforeCueNumber: number = null;
  private cuesheetId: string = '';
  private cueToDelete: number = null;
  public cueToEdit: number = null;  // Todo: Can't I make do with just rowToEdit?
  public rowToEdit: any = null;
  public cuesheetNameInput: boolean = false;
  public cuesheetDescriptionInput: boolean = false;
  public newCueRowState: string = 'display';
  private animationDuration: number = 1400; // Todo: Can I sync this automatically with the animation time?
  public focusTrigger = new EventEmitter<boolean>();
  public modalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService,
              private alertService: AlertService,
              private router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('_id');

    this.getCuesheet(this.cuesheetId);

    this.hideRedBoxOnModalClose();

  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  hideRedBoxOnModalClose() {
    // Todo: This is what I want to do, but it doesn't work!
    // this.modalService.onHide.subscribe((reason: string) => {
    //   $('.cue-row').removeClass('highlight');
    // });

    // This is my workaround. It's ugly, but it does work.
    $(document).on('click', (e) => {
      if (
          $(e.target).hasClass('modal') ||
          $(e.target).hasClass('modal-btn-dismiss') ||
          $(e.target).hasClass('close-modal')
      ) {
        $('.cue-row').removeClass('highlight');
        // $('#red-box').addClass('hide');
        $('#red-box').fadeOut(200);
      }
    });
  }

  getCuesheet(cuesheetId) {
    console.log("getCuesheet()", cuesheetId);
    this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.cuesheetModel.cuesheetName = cuesheet.name;
          this.cuesheetModel.cuesheetDescription = cuesheet.description;
          this.cuesheet = this.setTotalDistances(cuesheet);

          if ( this.cuesheet.cues.length === 0 ) {
            console.log("Apparently a new cue sheet!");
            this.cueModel.distance = '0';
            this.cueModel.turn = 'Start';
          }
        });
  }

  // Todo: Seems like an ugly solution. Isn't there a better way?
  setTotalDistances(cuesheet) {
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
      this.cuesheetModel.cuesheetName = cuesheet.name;
      this.cuesheetModel.cuesheetDescription = cuesheet.description;
      this.hideInputFields();
    })
  }

  saveCue() {
    this.cueModel.distance = Math.round(this.cueModel.distance * 100);
    this.focusTrigger.emit(true);

    if ( this.rowToEdit ) {
      this.updateCue();
    } else {
      this.createCue();
    }
  }

  updateCue() {
    console.log("updateCue()");
    this.cuesheetService.updateCue(this.cuesheet.cues[ this.cueToEdit ]._id.toString(), this.cueModel).then((cue: Cue) => {
      console.log(cue);
      if ( !cue ) return; // Safety precaution.
      // Get the updated cuesheet.
      this.total = 0;
      this.cueToEdit = null;
      this.rowToEdit = null;
      this.insertBeforeCueId = '';
      this.getCuesheet(this.cuesheetId);
    })
  }

  createCue() {
    this.cuesheetService.createCue(this.cuesheet._id, this.cueModel, this.insertBeforeCueId).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      if ( this.insertBeforeCueId ) {
        // The cue was inserted in the middle of cuesheet. Get the updated cuesheet.
        this.total = 0;
        this.getCuesheet(this.cuesheetId);
      } else {
        // The cue was added to the end of the cuesheet. Push the returned cue onto cuesheet.cues.
        this.total += cue.distance;
        cue.total = this.total;
        cue.state = 'display';
        this.cuesheet.cues.push(cue);
      }
      this.insertBeforeCueId = '';
    });
  }

  openCueDeletionModal(template: TemplateRef<any>, i: number) {
    this.cueToDelete = i;

    const rowToDelete = $(`#cue-row-${i}`);

    this.modalRef = this.modalService.show(template);

    $(rowToDelete).addClass('highlight');

    $('#red-box')
        .css({
          "top": rowToDelete.position().top - 4,
          "left": rowToDelete.position().left - 5,
          "height": rowToDelete.height() + 10,
          "width": rowToDelete.width() + 10
        })
        .fadeIn(200);
  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
      this.cuesheet.cues[ this.cueToDelete ].state = 'remove';
      // $('#red-box').addClass('hide');
      $('#red-box').fadeOut(400);

      setTimeout(() => {  // Removes the cue only after it has been faded. Not sure this is the best solution.
        if ( cue ) this.cuesheet.cues = _.filter(this.cuesheet.cues, cue => cue._id !== cueId);
        this.cuesheet.cues = _.filter(this.cuesheet.cues, cue => cue._id !== cueId);
        this.cueToDelete = null;
        this.total = 0;
        this.getCuesheet(this.cuesheetId);
      }, 1000);
    });
  }

  insertCue(i) {

    this.insertBeforeCueNumber = i;
    this.insertBeforeCueId = this.cuesheet.cues[ i ]._id;
    $(`#cue-row-${i} .insert-button-container`).hide();



    // this.newCueRowState = 'move';
    // setTimeout(() => {

      // Insert something in the cuesheet.cues array that marks where the row with input fields should be put, and if the fields should be prepopulated (which they should not in this case).

      // this.insertBeforeCueId = this.cuesheet.cues[ i ]._id;
      // $('.insert-button-container').show();
      // $(`#cue-row-${i} .insert-button-container`).hide();
      // $(`#cue-row-${i}`).before($('#new-cue-row'));
    // }, this.animationDuration / 2);

    // setTimeout(() => {
    //   this.newCueRowState = 'display';
    //   this.focusTrigger.emit(true);
    // }, this.animationDuration);
  }

  cancelCue() {
    this.newCueRowState = 'move';

    setTimeout(() => {
      $('#new-cue-row').after(this.rowToEdit);
      $('.cue-row').last().after($('#new-cue-row'));
      $('.insert-button-container').show();
      this.insertBeforeCueId = '';
      this.cueToEdit = null;
      this.rowToEdit = null;
    }, this.animationDuration / 2);

    setTimeout(() => {
      this.newCueRowState = 'display';
      this.focusTrigger.emit(true);
    }, this.animationDuration);

  }


  editCue(i) {
    if ( this.rowToEdit ) {
      $('#new-cue-row').after(this.rowToEdit);
    }

    this.rowToEdit = $(`#cue-row-${i}`);
    this.rowToEdit.after($('#new-cue-row'));
    this.cueModel.distance = this.cuesheet.cues[ i ].distance / 100;
    this.cueModel.turn = this.cuesheet.cues[ i ].turn;
    this.cueModel.description = this.cuesheet.cues[ i ].description;
    $(this.rowToEdit).remove();
    $('.insert-button-container').show();
    $(`#cue-row-${i + 1} .insert-button-container`).hide();
    this.cueToEdit = i;
  }

  openCuesheetDeletionModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteCuesheet() {
    this.cuesheetService.deleteCuesheet(this.cuesheet._id).then((cuesheet: Cuesheet) => {
      if ( cuesheet ) {
        this.alertService.success(`The cue sheet ${cuesheet.name} has been deleted.`);
        this.router.navigate([ '/cuesheets' ]);
      } else {
        this.alertService.error("Oops! Something went wrong!");
      }
    });
  }

  // Todo: Do I need this here? I do need it on the login-form.
  syncModel() {

  }


}
