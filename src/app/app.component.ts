import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthenticationService } from "./_services/authentication.service";
import { StatusService } from './_services/status.service';
import { RideService } from './_services/ride.service';
import { RiderService } from './_services/rider.service';
import { Rider } from './_models/rider';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  title: string = 'RidePlanner2';
  userName: string;
  currentRide: string;
  riders: Array<Rider>;

  constructor(private authenticationService: AuthenticationService, // Needs to be injected, to be initiated.
              private rideService: RideService,                     // Needs to be injected, to be initiated.
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchUser();
    this.watchCurrentRide();
    this.watchRiders(); // For debugging.
  }

  watchUser() {
    this.statusService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
      // console.log(`AppComponent. user: ${user}`);
      // console.log(user);
    });
  }

  watchCurrentRide() {
    this.statusService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  }

  // For debugging.
  watchRiders() {
    this.statusService.riders$.subscribe(riders => this.riders = riders);
  }


}
