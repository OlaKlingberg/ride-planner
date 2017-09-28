import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as Hammer from '../../../../node_modules/hammerjs/hammer';
import * as $ from 'jquery';

import { Cue } from '../cue';
import { Cuesheet } from '../cuesheet';
import { cuesheetBikeIframeAnimations } from './cuesheet-bike-iframe.component.animations';
import { CuesheetService } from '../cuesheet.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './cuesheet-bike-iframe.component.html',
  styleUrls: [ './cuesheet-bike-iframe.component.scss' ],
  animations: cuesheetBikeIframeAnimations
})
export class CuesheetBikeIframeComponent implements OnInit, OnDestroy {
  cueNumber: number = null;
  cuesheet: Cuesheet;
  cuesheetId: string = '';
  modalRef: BsModalRef;
  total: number = 0;
  move: string = 'still';

  private cuesContainer: any;
  private mc: any;
  private swipeSub: Subscription;

  @ViewChild('firstCueModal') firstCueModal: TemplateRef<any>;
  @ViewChild('lastCueModal') lastCueModal: TemplateRef<any>;

  constructor(private cuesheetService: CuesheetService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    console.log("CuesheetBikeIframeComponent");
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ 'cuesheetId' ];
      this.cueNumber = +params[ 'cueNumber' ];
      this.move = 'still';
    });

    this.getCuesheet(this.cuesheetId);
    this.setSwipeListeners();
    this.subscribeToSwipes();

    // Todo: This doesn't seem to make any difference, and I don't remember why I put it here.
    // $('#navbar').removeClass('in'); // Todo: This is surely not the best way of doing this ...
  }

  getCuesheet(cuesheetId) {
    this.cuesheetService.getCuesheet(cuesheetId)
        .then((cuesheet: Cuesheet) => {
          this.cuesheet = this.setIcons(this.setTotalDistances(cuesheet));
        });
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

// Todo: Seems like an ugly solution. Isn't there a better way?
  setTotalDistances(cuesheet) {
    cuesheet.cues = cuesheet.cues.map((cue: Cue) => {
      this.total += cue.distance;
      cue.total = this.total;
      return cue;
    });

    return cuesheet;
  }

  setSwipeListeners() {
    this.cuesContainer = $('#page-cuesheet-bike-iframe').get(0); // Todo: Is it okay to use jQuery for this? (It works.) Should I use viewChild instead?
    this.mc = Hammer(this.cuesContainer);

    // // mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); // Todo: Figure out why DIRECTION_ALL doesn't exist on Hammer.
    this.mc.get('swipe').set({ direction: 30 });  // This replaces the line above.

    this.mc.on('swipedown', () => {
      this.swipeDown();
    });

    this.mc.on('swipeup', () => {
      this.swipeUp();
    });
  }

  subscribeToSwipes() {
    this.swipeSub = this.cuesheetService.swipes$.subscribe(swipe => {
      if ( swipe === 'down' ) this.swipeDown();
      if ( swipe === 'up' ) this.swipeUp();
    })
  }

  swipeDown() {
    // console.log("swipeDown(). cueNumber:", this.cueNumber);
    if ( this.cueNumber <= 0 ) {
      if (this.modalRef) this.modalRef.hide();
      this.modalRef = this.modalService.show(this.firstCueModal);
    } else {
      if (this.modalRef) {
        this.modalRef.hide();
        this.modalRef = null;
      }
      this.move = 'down';
      setTimeout(() => {
        this.router.navigate([ `/cuesheet/iframe/${this.cuesheetId}/bike/${this.cueNumber - 1}` ]);
      }, 500);  // Todo: The delay here has to correspond to the time specified in the animation. Can I replace with a variable?
    }
  }

  swipeUp() {
    // console.log("swipeUp(). cueNumber:", this.cueNumber);
    if ( this.cueNumber >= this.cuesheet.cues.length - 1 ) {
      if (this.modalRef) this.modalRef.hide();
      this.modalRef = this.modalService.show(this.lastCueModal);
    } else {
      if (this.modalRef) {
        this.modalRef.hide();
        this.modalRef = null;
      }
      this.move = 'up';
      setTimeout(() => {
        this.router.navigate([ `/cuesheet/iframe/${this.cuesheetId}/bike/${this.cueNumber + 1}` ]);
        // this.move = 'still';
      }, 500);  // Todo: The delay here has to correspond to the time specified in the animation. Can I replace with a variable?
    }
  }

  ngOnDestroy() {
    this.mc.off('swipedown swipeup');
    this.swipeSub.unsubscribe();
  }

}
