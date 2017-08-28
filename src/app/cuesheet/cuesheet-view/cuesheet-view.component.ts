import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-view.component.html',
  styleUrls: [ './cuesheet-view.component.scss' ]
})
export class CuesheetViewComponent implements OnInit {
  cuesheet: Cuesheet;
  total: number = 0;

  constructor(private cuesheetService: CuesheetService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCuesheet();
  }

  getCuesheet() {
    let id = this.route.snapshot.paramMap.get('id');

    this.cuesheetService.getCuesheet(id)
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
