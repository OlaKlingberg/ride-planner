import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthenticationService } from "./authentication/authentication.service";
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  displayNavbar: boolean = true;

  private subscription: Subscription;

  constructor(public location: Location,
              private router: Router,
              private authenticationService: AuthenticationService) {   // Needs to be injected, to be initialized.
  }

  ngOnInit() {
    this.refreshAfterSleep();

    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.checkDisplayNavbar();
      }
    })
  }

  // Todo: Does this really belong in the AppComponent? Can I move it somewhere else?
  checkDisplayNavbar() {
    console.log(this.location.path());
    if (this.location.path().includes('/iframe')) return this.displayNavbar = true;


    if (this.location.path().includes('/map')) return this.displayNavbar = false;

    if (this.location.path().includes('/cuesheet/') && this.location.path().includes('/bike/')) return this.displayNavbar = false;

    this.displayNavbar = true;
  }

  // When you wake up a phone from sleep, the app sometimes freezes. Until I've figured out the reason, I use this workaround: when the device is awakened after sleeping more than 20s, the app automatically refreshes.
  // Todo: Test if this workaround is still needed. If so, try to make it unnecessary.
  refreshAfterSleep() {
    let now: number;
    let prev: number = Date.now();
    setInterval(() => {
      now = Date.now();

      if ( now - prev > 30000 ) {
        // window.location.reload();
      }

      prev = now;
      now = Date.now();
    }, 20000);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
