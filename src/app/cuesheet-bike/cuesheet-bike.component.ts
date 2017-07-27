import {
  AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy,
  OnInit
} from '@angular/core';
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
      transition('still => *', animate('500ms ease-in-out')),
    ])
  ]
})
export class CuesheetBikeComponent implements OnInit, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
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
      this.move = 'still';
    });
    this.getCuesheet();
    this.setSwipeListeners();

    $('#navbar').removeClass('in');

    this.setMasks()

  }

  setMasks() {
    const height = $(window).height();
    const width = $(window).width();

    $('.side-mask').width((width - 414) / 2).height(height);
    $('#bottom-mask').height(height - 736);
    console.log($('#left-mask').width());
    console.log($('#left-mask').height());
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
        // cue.icon = 'assets/img/arrows/left.png';
        cue.icon = 'left';
      } else if ( turn === 'R' || turn.toLowerCase().includes('right') ) {
        // cue.icon = 'assets/img/arrows/right.png';
        cue.icon = 'right'
      } else if ( turn.toLowerCase().includes('straight') || turn.toLowerCase().includes('across') ) {
        // cue.icon = 'assets/img/arrows/straight.png';
        cue.icon = 'straight';
      } else if ( turn.toLowerCase().includes('stop') || turn.toLowerCase().includes('end') ) {
        // cue.icon = 'assets/img/arrows/stop.png';
        cue.icon = 'stop';
      }

      return cue;
    });

    return cuesheet;
  }

  setSwipeListeners() {
    this.cuesContainer = $('#page').get(0);
    this.mc = Hammer(this.cuesContainer);

    // // mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); // Todo: Figure out why DIRECTION_ALL doesn't exist on Hammer.
    this.mc.get('swipe').set({ direction: 30 });

    this.mc.on('swipeup', () => {
      this.move = 'up';
      setTimeout(() => {
        this.router.navigate([ `/cuesheets/${this.cuesheetId}/bike/${this.cueNumber + 1}` ]);
      }, 500);
    });

    this.mc.on('swipedown', () => {
      this.move = 'down';
      setTimeout(() => {
        this.router.navigate([ `/cuesheets/${this.cuesheetId}/bike/${this.cueNumber - 1}` ]);
      }, 500);
    });

  }

  ngAfterContentInit() {
    // console.log("ngAfterContentInit");
  }

  ngAfterContentChecked() {
    // console.log("ngAfterContentChecked");
  }

  ngAfterViewInit() {
    // console.log("ngAfterViewInit");
  }

  ngAfterViewChecked() {
    // console.log("ngAfterViewChecked");
  }

  ngOnDestroy() {
    this.mc.off('swipedown swipeup');
  }

}
