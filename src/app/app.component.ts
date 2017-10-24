import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthenticationService } from "./authentication/authentication.service";
import { Subscription } from 'rxjs/Subscription';
import { EnvService } from './core/env.service';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  // displayNavbar: boolean = true;

  private subscription: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private EnvService: EnvService) {   // Needs to be injected, to be initialized.
  }

  ngOnInit() {
    this.refreshAfterSleep();
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
    if ( this.subscription ) this.subscription.unsubscribe();
  }

}
