import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { MapService } from '../_services/map.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit {
  private availableRides: Array<string> = [];
  private ride: string;
  private selectedRide: string;

  public model: any = [];

  constructor(private router: Router,
              private mapService: MapService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getCurrentRides();
    this.trackSelectedRide()
  }

  getCurrentRides() {
    // Simulate latency.
    setTimeout(() => {
      this.availableRides.push('Rockland Lakes', 'Asbury Park');
    }, 500);
  }

  trackSelectedRide() {
    this.mapService.selectedRide$.subscribe((ride) => {
      this.selectedRide = ride;
    });
  }

  onSubmit() {
    let user = this.authenticationService.user$.value;
    this.mapService.emitRider(user);
    // this.loggedIn = true;
    this.mapService.selectedRide$.next(this.model.ride);
    this.alertService.success(`You have been logged in to ride ${this.model.ride}`, true);

    return this.router.navigate([ '/riders-map2' ]);
  }

  logOutFromRide() {
    this.mapService.selectedRide$.next(null);
    this.mapService.removeRider();
    this.alertService.success("You have been logged out from the ride.");
  }

}

