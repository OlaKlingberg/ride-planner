import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cuesheet } from '../_models/cuesheet';
import { ActivatedRoute, Params } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';

@Component({
  selector: 'app-cuesheet',
  templateUrl: './cuesheet.component.html',
  styleUrls: [ './cuesheet.component.scss' ]
})
export class CuesheetComponent implements OnInit, OnDestroy {
  public cuesheet: any;  // Todo: Or should this be: @Input() cuesheet: Cuesheet; ?
  public total: number = 0;
  private cuesheetId: string = '';

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
  }

  // ngOnInit() {
  //   this.route.params.forEach((params: Params) => {
  //     const _id = params[ '_id' ];
  //     this.cuesheetService.getCuesheet(_id)
  //         .then(cuesheet => this.cuesheet = cuesheet);
  //   });
  // }
  //
  // // Todo: Seems like an ugly solution. Isn't there a better way?
  // setTotalDistances(cuesheet) {
  //   cuesheet.cues = cuesheet.cues.map(cue => {
  //     this.total += cue.distance;
  //     cue.total = this.total;
  //     return cue;
  //   });
  //
  //   return cuesheet;
  // }

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

  ngOnDestroy() {
  }
}
