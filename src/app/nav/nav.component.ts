import {
  AfterContentChecked, Component, OnInit
} from '@angular/core';
import { Location } from '@angular/common';
import { MiscService } from '../core/misc.service';
import { User } from '../user/user';
import * as $ from 'jquery';

import { UserService } from '../user/user.service';
import { navAnimations } from './nav.component.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../core/position.service';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit {
  public user: User = null;
  public ride: string;
  public navBarState: string;

  private route: string;

  constructor(private positionService: PositionService,
              private router: Router,
              private miscService: MiscService,
              private userService: UserService,
              public location: Location) {
  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();

    // this.userService.positionPromise.then(position => {
    //   console.log("NavComponent: userService.positionPromise.then: position:", position);
    // });

    this.router.events.subscribe(() => {
      this.route = this.router.url;
      // console.log(this.route);
    });
  }

  subscribeToNavBarState() {
    this.miscService.navBarState$
        .combineLatest(this.positionService.position$)
        .subscribe(([ navBarState, position ]) => {
          // Start the timer to hide the nav bar only when the map is shown, which happens when there is a latitude.
          if ( navBarState === 'show' ) this.navBarState = 'show';

          if ( position && position.coords && position.coords.latitude ) {
            setTimeout(() => { // Have to wait one tick before checking the value of the aria-expanded attribute.
              let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
              if ( navBarState === 'show' && !ariaExpanded && this.route === '/map' ) {
                this.navBarState = 'hide';
              }
            }, 0);
          }
        });


  }

  subscribeToUser() {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  // subscribeToNavBarState() {
  //   this.miscService.navBarState$.subscribe(navBarState => {
  //     this.navBarState = navBarState;
  //   });
  // }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

}
