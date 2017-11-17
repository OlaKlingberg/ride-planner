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
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit {
  bootstrapSize: string;
  demoMode: boolean;
  navBarState: string = 'hide';
  user: User = null;

  private route: string;

  constructor(private deviceSizeService: DeviceSizeService,
              private navService: NavService,
              private refreshService: RefreshService,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToBootstrapSize();
    this.subscribeToNavBarState();
    this.subscribeToRoute();
    this.subscribeToUser();
    this.demoMode = this.settingsService.demoMode;

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

  subscribeToBootstrapSize() {
    this.deviceSizeService.bootstrapSize$.subscribe(bootstrapSize => {
      this.bootstrapSize = bootstrapSize;
    });
  };

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
