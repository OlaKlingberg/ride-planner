import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, ParamMap } from '@angular/router';
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

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
  }

  ngOnInit() {
    this.getCuesheet();
  }

  getCuesheet() {
    let _id = this.route.snapshot.paramMap.get('_id');

    this.cuesheetService.getCuesheet(_id)
        .then(cuesheet => {
          this.setTotalDistances(cuesheet);
        });
  }

  setTotalDistances(cuesheet) {
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
      return cue;
    });

    this.cuesheet = cuesheet;
  }
}
