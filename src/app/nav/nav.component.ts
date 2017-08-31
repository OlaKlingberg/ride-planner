import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { navAnimations } from './nav.component.animations';
import { NavService } from './nav.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import * as $ from 'jquery';
import { RefreshService } from '../core/refresh.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit, OnDestroy {
  navBarState: string = 'hide';
  user: User = null;
  ride: string;

  private route: string;
  private subscriptions: Array<Subscription> = [];

  constructor(public location: Location,               // Used in the template.
              private navService: NavService,
              private refreshService: RefreshService,
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

      console.log("route:", this.route);

      this.refreshService.checkAutoRefresh().then(autoRefresh => {
        this.navBarState = autoRefresh && (this.route === '/map') ? 'hide' : 'show';
      });
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
