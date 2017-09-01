import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthenticationService } from "./authentication/authentication.service";
import { DebuggingService } from './debugger/debugging.service';
import { NavService } from './nav/nav.service';
import { PositionService } from './core/position.service';
import { UserService } from './user/user.service';
import { User } from './user/user';
import { RefreshService } from './core/refresh.service';
import set = Reflect.set;

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  accuracy: number = null;
  debugMessages: Array<any> = [];
  latitude: number = null;
  longitude: number = null;
  ride: string;
  title: string = 'RidePlanner';
  user: User = null;

  constructor(private authenticationService: AuthenticationService, // Needs to be injected, to be initialized.
              private debuggingService: DebuggingService,           // Needs to be injected, to be initialized.
              public location: Location,
              private positionService: PositionService,
              private userService: UserService) {                   // Is used in the template.
  }

  ngOnInit() {
    this.refreshAfterSleep();
    this.subscribeToPosition();
    this.subscribeToUser();
  }

  // The app sometimes froze on a phone when you woke the phone up after sleep. Until I've figured out the reason, I use this workaround: Refresh the app automatically if the device is being awakened after more than 20s of sleep.
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

  subscribeToPosition() {
    this.positionService.position$.subscribe(position => {
      if ( position ) {
        setTimeout(() => {
          this.latitude = position.coords.latitude;
        }, 0);
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
      }
    });
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      if ( user ) {
        this.ride = user.ride;
        this.user = new User(user);
      } else {
        this.ride = null;
        this.user = null;
      }
    });
  }


}
