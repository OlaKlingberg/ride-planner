import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';
import { Cuesheet } from '../_models/cuesheet';
import { Cue } from '../_models/cue';

@Component({
  selector: 'rp-cuesheet-bike',
  templateUrl: './cuesheet-bike.component.html',
  styleUrls: [ './cuesheet-bike.component.scss' ]
})
export class CuesheetBikeComponent implements OnInit {
  public cuesheetId: string = '';
  public cueNumber: number = null;
  public total: number = 0;
  public cuesheet: Cuesheet;
  public panCount: number = null;
  public swipeCount: number = null;
  public swipeupCount: number = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ 'cuesheetId' ];
      this.cueNumber = +params[ 'cueNumber' ];

      this.getCuesheet();
    });
  }

  getCuesheet() {
    this.cuesheetService.getCuesheet(this.cuesheetId)
        .then((cuesheet: Cuesheet) => {
          return this.setTotalDistances(cuesheet);
        })
        .then((cuesheet: Cuesheet) => {
          this.cuesheet = this.setIcons(cuesheet);
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

  setIcons(cuesheet) {
    cuesheet.cues = cuesheet.cues.map(cue => {
      const turn = cue.turn;
      if (turn === 'L' || turn.toLowerCase().includes('left') ) {
        cue.icon = 'assets/img/arrows/left.png';
      } else if (turn === 'R' || turn.toLowerCase().includes('right')) {
        cue.icon = 'assets/img/arrows/right.png';
      } else if (turn.toLowerCase().includes('straight') || turn.toLowerCase().includes('across')) {
        cue.icon = 'assets/img/arrows/straight.png';
      } else if (turn.toLowerCase().includes('stop')) {
        cue.icon = 'assets/img/arrows/stop.png';
      }

      return cue;
    });

    return cuesheet;
  }


  pan() {
    console.log("pan");
    this.panCount++;
  }

  swipe() {
    console.log("swipe");
    this.swipeCount++;
    // this.router.navigate([`/cuesheets/${this.cuesheetId}/bike/${this.cueNumber + 1}`]);
  }

  swipeup() {
    console.log("swipeup");
    this.swipeupCount++;
    this.router.navigate([`/cuesheets/${this.cuesheetId}/bike/${this.cueNumber + 1}`]);
  }

}
