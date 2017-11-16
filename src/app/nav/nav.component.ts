import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { navAnimations } from './nav.component.animations';
import { NavService } from './nav.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import * as $ from 'jquery';
import { RefreshService } from '../core/refresh.service';
import Timer = NodeJS.Timer;
import { DeviceSizeService } from '../device-size/device-size.service';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit {
  navBarState: string = 'hide';
  user: User = null;

  private route: string;

  constructor(private deviceSizeService: DeviceSizeService,
              private navService: NavService,
              private refreshService: RefreshService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToNavBarState();
    this.subscribeToRoute();
    this.subscribeToUser();

    $(document).on("scroll", () => {
      if ($(document).scrollTop() > 20) {
        $("nav").removeClass("unscrolled");
      } else {
        $("nav").addClass("unscrolled");
      }
    });
  }

  closeAccordion() {
    if ($('.navbar-toggler').attr('aria-expanded') === 'true') $('.navbar-toggler').click();
  }

  subscribeToNavBarState() {
    this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
  }

  // On normal page navigation, show the nav bar.
  // After auto-refresh, don't show the nav bar if the page displayed is /map.
  subscribeToRoute() {
    let timer: Timer;

    this.router.events.subscribe(() => {
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
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }
}
