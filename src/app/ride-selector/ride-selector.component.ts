import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RideService } from "../_services/ride.service";
import { RiderService } from '../_services/rider.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit {
  private model: any = [];
  private availableRides: Array<string>;
  private currentRide: string;

  constructor(private router: Router,
              private rideService: RideService,
              private riderService: RiderService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.getAvailableRides();
    this.getCurrentRide();
  }

  getAvailableRides() {
    this.riderService.availableRides$.subscribe((availableRides) => {
      this.availableRides = availableRides;
    });
  };

  getCurrentRide() {
    this.rideService.currentRide$.subscribe((currentRide) => {
      this.currentRide = currentRide;
    });
  };

  onSubmit() {
    // let user = this.authenticationService.user$.value;
    let ride = this.model.ride;

    this.rideService.currentRide$.next(ride);

    // this.riderService.emitRider(user, ride);
    this.alertService.success(`You have been logged in to ride ${this.model.ride}`, true);

    return this.router.navigate([ '/riders-map2' ]);
  }

  logOutFromRide() {
    this.rideService.currentRide$.next(null);
    // this.riderService.removeRider();
    this.alertService.success("You have been logged out from the ride.");
  }

}

