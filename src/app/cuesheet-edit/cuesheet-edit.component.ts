import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';
import { Cuesheet } from '../_models/cuesheet';
import { Cue } from '../_models/cue';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'rp-cuesheet-edit',
  templateUrl: './cuesheet-edit.component.html',
  styleUrls: [ './cuesheet-edit.component.scss' ],
  animations: [
    trigger('cueState', [
      state('display', style({
        opacity: 1,
      })),
      state('remove', style({
        opacity: 0,
      })),
      transition('display => remove', [
        animate('1000ms')
      ])
    ])
  ]
})
export class CuesheetEditComponent implements OnInit {
  @Input() cuesheet: Cuesheet;

  // public cuesheet: Cuesheet;  // Todo: Or should this be: @Input() cuesheet: Cuesheet; ?
  public cueModel: any = {};
  public cuesheetModel: any = {};
  public total: number = 0;
  public insertBeforeId: string = '';
  private cuesheetId: string = '';
  private cueToDelete: number = null;
  public cueToEdit: number = null;  // Todo: Can't I make do with just rowToEdit?
  public rowToEdit: any = null;
  public cuesheetNameInput: boolean = false;
  public cuesheetDescriptionInput: boolean = false;

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService,
              private alertService: AlertService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ '_id' ];

      this.getCuesheet();
    });

    this.removeRowBorderOnModalClose();
  }

  removeRowBorderOnModalClose() {
    // Todo: This is what I want to do, but it doesn't work!
    // $('#cueDeletionModal').on('hidden.bs.modal', () => $('.cue-row').removeClass('highlight'));

    // This is my workaround. It's ugly, but it seems to work.
    $(document).on('click', (e) => {
      if (
          $(e.target).hasClass('modal') ||
          $(e.target).hasClass('modal-btn-dismiss') ||
          $(e.target).hasClass('close-modal')
      ) {
        $('.cue-row').removeClass('highlight');
        $('#red-box').addClass('hide');
      }
    });
  }

  getCuesheet() {
    this.cuesheetService.getCuesheet(this.cuesheetId)
        .then(cuesheet => {
          this.cuesheetModel.cuesheetName = cuesheet.name;
          this.cuesheetModel.cuesheetDescription = cuesheet.description;
          this.cuesheet = this.setTotalDistances(cuesheet);
          this.cuesheet.cues = this.cuesheet.cues.map(cue => {
            cue.state = 'display';  // Used for animation.
            return cue;
          });
        });
  }

  // Todo: Seems like an ugly solution. Isn't there a better way?
  setTotalDistances(cuesheet) {
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
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
    this.hideInputFields()
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

    if ( this.rowToEdit ) {
      this.updateCue();
    } else {
      this.createCue();
    }
  }

  updateCue() {
    this.cuesheetService.updateCue(this.cuesheet.cues[ this.cueToEdit ]._id.toString(), this.cueModel).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      // Get the updated cuesheet.
      this.total = 0;
      this.cueToEdit = null;
      this.rowToEdit = null;
      this.insertBeforeId = '';
      this.getCuesheet();
    })
  }

  createCue() {
    this.cuesheetService.createCue(this.cuesheet._id, this.cueModel, this.insertBeforeId).then((cue: Cue) => {
      if ( !cue ) return; // Safety precaution.
      if ( this.insertBeforeId ) {
        // The cue was inserted in the middle of cuesheet. Get the updated cuesheet.
        this.total = 0;
        this.getCuesheet();
      } else {
        // The cue was added to the end of the cuesheet. Push the returned cue onto cuesheet.cues.
        this.total += cue.distance;
        cue.total = this.total;
        cue.state = 'display';
        this.cuesheet.cues.push(cue);
      }
      this.insertBeforeId = '';
    });
  }

  prepareToDeleteCue(i) {
    this.cueToDelete = i;
    const rowToDelete = $(`#cue-row-${i}`);
    $(rowToDelete).addClass('highlight');

    $('#red-box')
        .removeClass('hide')
        .css({
          "top": rowToDelete.position().top - 5,
          "left": rowToDelete.position().left - 5,
          "height": rowToDelete.height() + 10,
          "width": rowToDelete.width() + 10
        });


  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
      this.cuesheet.cues[ this.cueToDelete ].state = 'remove';
      $('#red-box').addClass('hide');

      setTimeout(() => {  // Removes the cue only after it has been faded. Not sure this is the best solution.
        if ( cue ) this.cuesheet.cues = _.filter(this.cuesheet.cues, cue => cue._id !== cueId);
        this.cueToDelete = null;
        this.total = 0;
        this.getCuesheet();
      }, 1500);
    });
  }


  insertCue(i) {
    $('.insert-button-container').show();
    $(`#cue-row-${i} .insert-button-container`).hide();
    $(`#cue-row-${i}`).before($('#new-cue-row'));
    this.insertBeforeId = this.cuesheet.cues[ i ]._id;
  }

  cancelCue() {
    // if (this.rowToEdit) {
    //   $('.cue-row').last().remove();
    // }

    $('#new-cue-row').after(this.rowToEdit);
    $('.insert-button-container').show();
    $('.cue-row').last().after($('#new-cue-row'));
    this.insertBeforeId = '';
    this.cueToEdit = null;
    this.rowToEdit = null;
  }

  editCue(i) {
    if ( this.rowToEdit ) {
      $('#new-cue-row').after(this.rowToEdit);
    } else {
      // $('.cue-row').last().after("<tr class='cue-row invisible'><td>&nbsp;</td></tr>");
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

  deleteCuesheet() {
    this.cuesheetService.deleteCuesheet(this.cuesheet._id).then((cuesheet: Cuesheet) => {
      if ( cuesheet ) {
        this.alertService.success(`The cue sheet <i>${cuesheet.name}</i> has been deleted.`);
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
