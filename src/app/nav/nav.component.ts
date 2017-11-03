import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

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
export class NavComponent implements OnInit {
  deviceSize: string;
  display: boolean = true;
  marginBottomNone: boolean =  false;
  navBarState: string = 'hide';
  user: User = null;

  private route: string;

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

    this.deviceSize = getBootstrapDeviceSize();
    window.addEventListener('resize', this.setDeviceSize);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.checkHowToDisplay();
      }
    });

  }

  // I can't use an arrow function here, because I need to bind "this."
  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
  }.bind(this);

  checkHowToDisplay() {
    this.display = !this.location.path().includes('/frame');
    this.marginBottomNone = this.location.path() === '/members' ||
        this.location.path() === '/riders' ||
        this.location.path() === '/settings';
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

  subscribeToNavBarState() {
    let sub = this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
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
  }

  subscribeToUser() {
    let sub = this.userService.user$.subscribe(
        user => this.user = user
    );
  }
}
