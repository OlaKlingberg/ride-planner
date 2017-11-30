import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { PositionService } from '../../core/position.service';
import { Ride } from '../ride';
import { RideService } from '../ride.service';
import { RiderService } from '../../rider/rider.service';
import { RideSubjectService } from '../ride-subject.service';
import { SettingsService } from '../../settings/settings.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  availableRides: Ride[] = [];
  model: any = [];
  ride: string = '';
  user: User = null;

  private returnUrl: string;
  private subscriptions: Array<Subscription> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private positionService: PositionService,
              private rideService: RideService,
              private riderService: RiderService,       // Must be initialized here, for RiderList to work.
              private rideSubjectService: RideSubjectService,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/map';
    this.positionService.getPosition(); // So the app has it, when the user gets to the map.
    this.rideService.emitGiveMeAvailableRides();
    this.subscribeToAvailableRides();
    this.subscribeToRide();
    this.subscribeToUser();
  }

  logIntoRide() {
    this.rideSubjectService.ride$.next(this.model.ride);
    eval(this.settingsService.storage).setItem('rpRide', this.model.ride);
    this.router.navigate([ this.returnUrl ]);
  }

  logOutFromRide() {
    this.rideService.emitLeaveRide();
    eval(this.settingsService.storage).removeItem('rpRide');
    this.rideSubjectService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);
  }

  subscribeToAvailableRides() {
    const sub: Subscription = this.rideSubjectService.availableRides$.subscribe((availableRides: Ride[]) => {
      if (availableRides) {
        this.availableRides = availableRides.reverse();
        this.model.ride = availableRides[0].name;
      }
    });
    this.subscriptions.push(sub);
  }

  subscribeToRide() {
    const sub = this.rideSubjectService.ride$.subscribe((ride: string) => {
      this.ride = ride;
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    const sub: Subscription = this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    })
  }

}

