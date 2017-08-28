import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { navAnimations } from './nav.component.animations';
import { NavService } from './nav.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import * as $ from 'jquery';


@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit, OnDestroy {
  navBarState: string;
  user: User = null;
  ride: string;

  private route: string;
  private subscriptions: Array<Subscription> = [];

  constructor(public location: Location,               // Used in the template. Has to be initialized?
              private navService: NavService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToNavBarState();
    this.subscribeToRoute();
    this.subscribeToUser();
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

  subscribeToNavBarState() {
    let sub = this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
    this.subscriptions.push(sub);
  }

  subscribeToRoute() {
    let sub = this.router.events.subscribe(() => {
      this.route = this.router.url;
      this.navBarState = 'show';
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    let sub = this.userService.user$.subscribe(
        user => this.user = user
    );
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    });
  }
}
