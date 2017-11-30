import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from "./authentication/authentication.service";
import { DeviceSizeService } from './device-size/device-size.service';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  bootstrapSize: string;

  private subscription: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private deviceSizeService: DeviceSizeService) {   // Needs to be injected, to be initialized.
  }

  ngOnInit() {
    this.refreshAfterSleep();
    this.subscribeToBootstrapSize();
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

  subscribeToBootstrapSize() {
    this.deviceSizeService.bootstrapSize$.subscribe(bootstrapSize => {
      this.bootstrapSize = bootstrapSize;
    });
  };

  ngOnDestroy() {
    if ( this.subscription ) this.subscription.unsubscribe();
  }

}
