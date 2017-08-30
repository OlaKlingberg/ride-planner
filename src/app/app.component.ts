import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthenticationService } from "./authentication/authentication.service";
import { DebuggingService } from './debugger/debugging.service';
import { NavService } from './nav/nav.service';
import { PositionService } from './core/position.service';
import { UserService } from './user/user.service';
import { User } from './user/user';
import { RefreshService } from './core/refresh.service';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  accuracy: number;
  debugMessages: Array<any> = [];
  latitude: number = null;
  longitude: number;
  ride: string;
  title: string = 'RidePlanner';
  user: User;

  constructor(private authenticationService: AuthenticationService, // Needs to be injected, to be initialized.
              private debuggingService: DebuggingService,           // Needs to be injected, to be initialized.
              public location: Location,
              private navService: NavService,
              private positionService: PositionService,
              // private refreshService: RefreshService,
              private userService: UserService) {                   // Is used in the template.
  }

  ngOnInit() {
    this.refreshAfterSleep();
    this.subscribeToPosition();
    this.subscribeToUser();
    // this.refreshService.refresh();
  }

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
        this.latitude = position.coords.latitude;
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

  // Todo: Figure out if I need this.
  showNavBar() {
    // this.navService.navBarState$.next('show');
  }

}
