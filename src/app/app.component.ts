import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthenticationService } from "./authentication/authentication.service";

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  constructor(public location: Location,
              private authenticationService: AuthenticationService) {   // Needs to be injected, to be initialized.
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

      if ( now - prev > 3000 ) {
        window.location.reload();
      }

      prev = now;
      now = Date.now();
    }, 2000);
  }

}
