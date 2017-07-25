import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Cuesheet } from '../_models/cuesheet';
import { CuesheetService } from '../_services/cuesheet.service';

@Component({
  selector: 'rp-cuesheet',
  templateUrl: './cuesheet.component.html',
  styleUrls: [ './cuesheet.component.scss' ]
})
export class CuesheetComponent implements OnInit {
  public cuesheet: Cuesheet;
  public total: number = 0;
  private cuesheetId: string = '';

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
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
            // cue.state = 'display';  // Used for animation.
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


}
