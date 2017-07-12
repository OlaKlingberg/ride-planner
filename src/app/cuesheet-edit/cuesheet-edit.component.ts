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
  selector: 'app-cuesheet-edit',
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
export class CuesheetEditComponent implements OnInit, OnDestroy {
  @Input() cuesheet: Cuesheet;

  // public cuesheet: Cuesheet;  // Todo: Or should this be: @Input() cuesheet: Cuesheet; ?
  public model: any = {};
  public total: number = 0;
  private insertBeforeId: string = '';
  private cuesheetId: string = '';
  private cueToDelete: number = null;

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
    // $('#cueDeletionModal').on('hidden.bs.modal', () => $('.cue-row').removeClass('red-border'));

    // This is my workaround. It's ugly, but it seems to work.
    $(document).on('click', (e) => {
      if ( $(e.target).hasClass('modal') ) {
        $('.cue-row').removeClass('red-border');
        $('#highlighted-box').addClass('hide');
      }
      if ( $(e.target).hasClass('modal-btn-dismiss') ) {
        $('.cue-row').removeClass('red-border');
        $('#highlighted-box').addClass('hide');
      }
      if ( $(e.target).hasClass('close-modal') ) {
        $('.cue-row').removeClass('red-border');
        $('#highlighted-box').addClass('hide');
      }
    });
  }

  getCuesheet() {
    this.cuesheetService.getCuesheet(this.cuesheetId)
        .then(cuesheet => {
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

  saveCue() {
    this.model.distance = Math.round(this.model.distance * 100);

    this.cuesheetService.saveCue(this.cuesheet._id, this.model, this.insertBeforeId).then((cue: Cue) => {
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
    $(rowToDelete).addClass('red-border');
    // console.log(rowToDelete.position());
    // console.log(rowToDelete.offset());
    // console.log(rowToDelete.height());
    // console.log(rowToDelete.width());

    $('#highlighted-box')
        .removeClass('hide')
        .css({
          "top": rowToDelete.position().top -5,
          "left": rowToDelete.position().left -5,
          "height": rowToDelete.height() +10,
          "width": rowToDelete.width() +10
        });



  }

  deleteCue() {
    const cueId = this.cuesheet.cues[ this.cueToDelete ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId).then((cue: Cue) => {
      this.cuesheet.cues[ this.cueToDelete ].state = 'remove';
      $('#highlighted-box').addClass('hide');

      setTimeout(() => {  // Removes the cue only after it has been faded. Not sure this is the best solution.
        if ( cue ) this.cuesheet.cues = _.filter(this.cuesheet.cues, cue => cue._id !== cueId);
        this.cueToDelete = null;
      }, 1500);
    });
  }


  insertCue(i) {
    $('.insert-button-container').show();
    $(`#cue-row-${i} .insert-button-container`).hide();
    $(`#cue-row-${i}`).before($('#new-cue-row'));
    this.insertBeforeId = this.cuesheet.cues[ i ]._id;
  }

  cancel() {
    $('.insert-button-container').show();
    $('.cue-row').last().after($('#new-cue-row'));
    this.insertBeforeId = '';
  }

  // saveCuesheet() {
  //
  // }

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

  // Todo: Do I need this?
  syncModel() {

  }

  ngOnDestroy() {
  }

}
