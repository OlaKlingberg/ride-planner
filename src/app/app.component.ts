import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from "./authentication/authentication.service";
import { MiscService } from './core/misc.service';
import { DebuggingService } from './debugger/debugging.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  title: string = 'RidePlanner';
  userName: string;
  ride: string;
  debugMessages: Array<any> = [];
  latitude: number;
  longitude: number;
  accuracy: number;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService, // Needs to be injected, to be initialized.
              private debuggingService: DebuggingService,           // Needs to be injected, to be initialized.
              private miscService: MiscService,
              public location: Location) {                          // Is used in the template.
  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToPosition();
    this.refreshAfterSleep();
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;  // Todo: Surely, this ugliness shouldn't be necessary!
      if ( user ) this.ride = user.ride;
    });
  }

  subscribeToPosition() {
    this.userService.position$.subscribe(position => {
      if ( position ) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
      }
    });
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

  showNavBar() {
    this.miscService.navBarState$.next('show');
  }

}
