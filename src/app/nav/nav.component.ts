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
import Timer = NodeJS.Timer;

import { getBootstrapDeviceSize } from '../_lib/util';


@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit, OnDestroy {
  deviceSize: string;
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

    window.addEventListener('resize', this.setDeviceSize);
    this.deviceSize = getBootstrapDeviceSize();
  }

  // I can't use an arrow function here, because I need to bind "this."
  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
  }.bind(this);

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

  subscribeToNavBarState() {
    let sub = this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
    this.subscriptions.push(sub);
  }

  // On normal page navigation, show the nav bar.
  // After auto-refresh, don't show the nav bar if the page displayed is /map.
  subscribeToRoute() {
    let timer: Timer;

    let sub = this.router.events.subscribe(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.route = this.router.url;

        this.refreshService.autoRefreshPromise().then(autoRefresh => {
          this.navBarState = autoRefresh && (this.route === '/map') ? 'hide' : 'show';
        });
      }, 100);

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

    removeEventListener('resize', this.setDeviceSize);
  }
}
