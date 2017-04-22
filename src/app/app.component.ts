import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthenticationService } from "./_services/authentication.service";
import { RiderService } from './_services/rider.service';
import { RideService } from "app/_services/ride.service";

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  private title: string = 'RidePlanner2';
  private userName: string;
  private currentRide: string;

  constructor(private authenticationService: AuthenticationService,
              private rideService: RideService) {
  }

  ngOnInit() {
    this.logInWithToken();
    this.trackUser();
    this.getCurrentRide();
    this.trackCurrentRide();
  }

  logInWithToken() {
    const currentToken = JSON.parse(localStorage.getItem('currentToken'));

    if ( currentToken ) {
      this.authenticationService.authenticateByToken(currentToken);
    }
  }

  trackUser() {
    this.authenticationService.user$.subscribe((user) => {
      if ( user ) {
        this.userName = `${user.fname} ${user.lname}`;
      } else {
        this.userName = null;
      }
    });
  }

  getCurrentRide() {
    this.rideService.currentRide$.next(localStorage.getItem('currentRide'));
  }

  trackCurrentRide() {
    this.rideService.currentRide$.subscribe((currentRide) => {
      this.currentRide = currentRide;
    });
  }


}
