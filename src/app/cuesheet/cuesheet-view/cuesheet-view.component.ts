import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-view.component.html',
  styleUrls: [ './cuesheet-view.component.scss' ]
})
export class CuesheetViewComponent implements OnInit {
  public cuesheet: Cuesheet;
  public total: number = 0;

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
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
