import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Cuesheet } from '../cuesheet';
import { CuesheetDemoService } from '../cuesheet-demo.service';

@Component({
  templateUrl: './cuesheet-view.component.html',
  styleUrls: [ './cuesheet-view.component.scss' ]
})
export class CuesheetViewDemoComponent implements OnInit {
  cuesheet: Cuesheet;
  cuesheetId: string = '';  // routerLink in the template doesn't work with cuesheet?._id. Hence this solution.
  demoMode = true;
  total: number = 0;

  constructor(private cuesheetDemoService: CuesheetDemoService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('id');

    this.getCuesheet(this.cuesheetId);
  }

  getCuesheet(cuesheetId) {
    this.cuesheetDemoService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.cuesheet = this.setTotalDistances(cuesheet);
        });
  }

  setTotalDistances(cuesheet) {
    if (!cuesheet) return;
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
      return cue;
    });

    return cuesheet;
  }
}
