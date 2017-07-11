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

    this.cuesheetService.saveCue(this.cuesheet._id, this.model, this.insertBeforeId)
        .then((cue: Cue) => {
          if ( cue ) {  // Safety precaution.
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
          }
        });
  }

  deleteCue(i) {
    const cueId = this.cuesheet.cues[ i ]._id;
    this.cuesheetService.deleteCue(this.cuesheet._id, cueId)
        .then((cue: Cue) => {
          this.cuesheet.cues[ i ].state = 'remove';

          setTimeout(() => {  // Removes the cue only after it has been faded. Not sure this is the best solution.
            if ( cue ) this.cuesheet.cues = _.filter(this.cuesheet.cues, cue => cue._id !== cueId);
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
    this.cuesheetService.deleteCuesheet(this.cuesheet._id)
        .then((cuesheet: Cuesheet) => {
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
