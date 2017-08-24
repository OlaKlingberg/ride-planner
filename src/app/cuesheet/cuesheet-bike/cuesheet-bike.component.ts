import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { CuesheetService } from '../cuesheet.service';
import { Cuesheet } from '../cuesheet';
import { Cue } from '../cue';
import * as $ from 'jquery';
import * as Hammer from '../../../../node_modules/hammerjs/hammer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
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
export class CuesheetBikeComponent implements OnInit, OnDestroy {
  public cuesheetId: string = '';
  public cueNumber: number = null;
  public total: number = 0;
  public cuesheet: Cuesheet;
  private cuesContainer: any;
  private mc: any;
  public move: string = 'still';
  public modalRef: BsModalRef;

  @ViewChild('firstCueModal') firstCueModal: TemplateRef<any>;
  @ViewChild('lastCueModal') lastCueModal: TemplateRef<any>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private cuesheetService: CuesheetService,
              private modalService: BsModalService) {
  }


  ngOnInit() {
    this.cueNumber = +this.route.snapshot.paramMap.get('cueNumber');
    this.cuesheetId = this.route.snapshot.paramMap.get('cuesheetId');

    this.getCuesheet(this.cuesheetId);
    this.setSwipeListeners();

    $('#navbar').removeClass('in'); // Todo: This is surely not the right way of doing this ...

  }

  getCuesheet(cuesheetId) {
    this.cuesheetService.getCuesheet(cuesheetId)
        .then((cuesheet: Cuesheet) => {
          return this.setTotalDistances(cuesheet);
        })
        .then((cuesheet: Cuesheet) => {
          this.cuesheet = this.setIcons(cuesheet);
        })
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
        cue.icon = 'left';
      } else if ( turn === 'R' || turn.toLowerCase().includes('right') ) {
        cue.icon = 'right'
      } else if ( turn.toLowerCase().includes('straight') || turn.toLowerCase().includes('across') ) {
        cue.icon = 'straight';
      } else if ( turn.toLowerCase().includes('stop') || turn.toLowerCase().includes('end') ) {
        cue.icon = 'stop';
      }

      return cue;
    });

    return cuesheet;
  }

  setSwipeListeners() {
    this.cuesContainer = $('#page').get(0); // Todo: Is it okay to use jQuery for this? (It works.) Should I use viewChild instead?
    this.mc = Hammer(this.cuesContainer);

    // // mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); // Todo: Figure out why DIRECTION_ALL doesn't exist on Hammer.
    this.mc.get('swipe').set({ direction: 30 });  // This replaces the line above.

    this.mc.on('swipeup', () => {
      if ( this.cueNumber >= this.cuesheet.cues.length - 1 ) {
        this.modalRef = this.modalService.show(this.lastCueModal);
      } else {
        this.move = 'up';
        setTimeout(() => {
          this.router.navigate([ `/cuesheet/${this.cuesheetId}/bike/${this.cueNumber + 1}` ]);
          // this.move = 'still';
        }, 500);  // Todo: The delay here has to correspond to the time specified in the animation. Can I replace with a variable?
      }
    });

    this.mc.on('swipedown', () => {
      if ( this.cueNumber <= 0 ) {
        this.modalRef = this.modalService.show(this.firstCueModal);
      } else {
        this.move = 'down';
        setTimeout(() => {
          this.router.navigate([ `/cuesheet/${this.cuesheetId}/bike/${this.cueNumber - 1}` ]);
        }, 500);  // Todo: The delay here has to correspond to the time specified in the animation. Can I replace with a variable?
      }
    });

  }

  ngOnDestroy() {
    this.mc.off('swipedown swipeup');
  }

}
