import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RiderService } from '../_services/rider.service';
import { AlertService } from '../_services/alert.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  private model: any = [];
  private coords: any = null;
  private availableRides: Array<string>;
  public currentRide: string;
  private availableRidesSub: Subscription;
  private currentRideSub: Subscription;
  private coordsSub: Subscription;

  constructor(private router: Router,
              private riderService: RiderService) {
  }

  ngOnInit() {
    this.watchCoords();
    this.watchAvailableRides();
    this.watchCurrentRide();
  }

  watchCoords() {
    this.coordsSub = this.riderService.coords$.subscribe(coords => {
      this.coords = coords;
    });
  }

  watchAvailableRides() {
    this.availableRidesSub = this.riderService.availableRides$.subscribe((availableRides) => {
      this.availableRides = availableRides;
    });
  };

  watchCurrentRide() {
    this.currentRideSub = this.riderService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  };

  onSubmit() {
    let ride = this.model.ride;
    this.riderService.currentRide$.next(ride);

    return this.router.navigate([ '/map' ]);
  }

  logOutFromRide() {
    this.riderService.emitRemoveRider();
  }

  ngOnDestroy() {
    this.availableRidesSub.unsubscribe();
    this.currentRideSub.unsubscribe();
    this.coordsSub.unsubscribe();
  }

}

