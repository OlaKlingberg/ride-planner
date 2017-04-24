import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RideService } from "../_services/ride.service";
import { RiderService } from '../_services/rider.service';
import { AlertService } from '../_services/alert.service';
import { StatusService } from '../_services/status.service';

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
              private alertService: AlertService,
              private riderService: RiderService,  // Needs to be injected, to be initiated.
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchAvailableRides();
    this.watchCurrentRide();
  }

  watchAvailableRides() {
    this.statusService.availableRides$.subscribe((availableRides) => {
      this.availableRides = availableRides;
    });
  };

  watchCurrentRide() {
    this.statusService.currentRide$.subscribe((currentRide) => {
      this.currentRide = currentRide;
    });
  };

  onSubmit() {
    let ride = this.model.ride;
    this.statusService.currentRide$.next(ride);
    this.alertService.success(`You have been logged in to ride ${ride}`, true);

    return this.router.navigate([ '/riders-map2' ]);
  }

  logOutFromRide() {
    this.alertService.success("You have been logged out from the ride.");
    this.statusService.currentRide$.next(null);
  }

}

