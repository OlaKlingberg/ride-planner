import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { environment } from "../../../environments/environment";
import { RideSubjectService } from '../ride-subject.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { RideService } from '../ride.service';
import { PositionService } from '../../core/position.service';

@Component({
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  model: any = [];
  user: User = null;

  private availableRides: Array<string> = null;
  private subscriptions: Array<Subscription> = [];

  constructor(
      // positionService: PositionService, // Initialize here, so that geolocation coords will be ready when the user gets to the map.
              private rideService: RideService,
              private rideSubjectService: RideSubjectService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.rideService.emitGiveMeAvailableRides();
    this.subscribeToAvailableRides();
    this.subscribeToUser();
  }

  logIntoRide() {
    this.rideSubjectService.ride$.next(this.model.ride);
    environment.storage.setItem('rpRide', this.model.ride);
    this.router.navigate([ '/map' ]);
  }

  logOutFromRide() {
    this.rideService.emitLeaveRide();
    environment.storage.removeItem('rpRide');
    this.rideSubjectService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);
  }

  subscribeToAvailableRides() {
    const sub = this.rideSubjectService.availableRides$.subscribe((availableRides: Array<string>) => {
      this.availableRides = availableRides;
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    const subscription: Subscription = this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    })
  }

}

