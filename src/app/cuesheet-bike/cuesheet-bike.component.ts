import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { CuesheetService } from '../_services/cuesheet.service';
import { Cuesheet } from '../_models/cuesheet';
import { Cue } from '../_models/cue';
import * as $ from 'jquery';
import * as Hammer from '../../../node_modules/hammerjs/hammer';

@Component({
  selector: 'rp-cuesheet-bike',
  templateUrl: './cuesheet-bike.component.html',
  styleUrls: [ './cuesheet-bike.component.scss' ],
  animations: [
    trigger('cuesheetContainer', [
      state('up', style({
        transform: 'translate(0, -217px)'
      })),
      state('down', style({
        transform: 'translate(0, 217px)'
      })),
      transition('still => up', animate('500ms ease-in-out')),
      transition('still => down', animate('500ms ease-in-out'))
    ])
  ]
})
export class CuesheetBikeComponent implements OnInit, OnDestroy {
  public cuesheetId: string = '';
  public cueNumber: number = null;
  public total: number = 0;
  public cuesheet: Cuesheet;
  private cuesContainer: any;
  private mc: any;
  public move: string = 'still';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ 'cuesheetId' ];
      this.cueNumber = +params[ 'cueNumber' ];
    });
    this.getCuesheet();
    this.setSwipeListeners();
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
    cuesheet.cues = cuesheet.cues.map((cue: Cue) => {
      this.total += cue.distance;
      cue.total = this.total;
      return cue;
    });

    return cuesheet;
  }

  setIcons(cuesheet) {
    cuesheet.cues = cuesheet.cues.map((cue: Cue) => {
      const turn = cue.turn;
      if ( turn === 'L' || turn.toLowerCase().includes('left') ) {
        cue.icon = 'assets/img/arrows/left.png';
      } else if ( turn === 'R' || turn.toLowerCase().includes('right') ) {
        cue.icon = 'assets/img/arrows/right.png';
      } else if ( turn.toLowerCase().includes('straight') || turn.toLowerCase().includes('across') ) {
        cue.icon = 'assets/img/arrows/straight.png';
      } else if ( turn.toLowerCase().includes('stop') ) {
        cue.icon = 'assets/img/arrows/stop.png';
      }

      return cue;
    });

    return cuesheet;
  }

  setSwipeListeners() {
    this.cuesContainer = $('#page').get(0);
    this.mc = new Hammer(this.cuesContainer);

    // // mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); // Todo: Figure out why DIRECTION_ALL doesn't exist on Hammer.
    this.mc.get('swipe').set({ direction: 30 });

    this.mc.on('swipeup', () => {
      this.move = 'up';
      setTimeout(() => {
        this.move = 'still';
        this.router.navigate([ `/cuesheets/${this.cuesheetId}/bike/${this.cueNumber + 1}` ]);
      }, 600);
    });

    this.mc.on('swipedown', () => {
      this.move = 'down';
      setTimeout(() => {
        this.move = 'still';
        this.router.navigate([ `/cuesheets/${this.cuesheetId}/bike/${this.cueNumber - 1}` ]);
      }, 600);
    });

  }

  ngOnDestroy() {
    this.mc.off('swipedown swipeup');
  }

}
