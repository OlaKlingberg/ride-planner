import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Ride } from '../ride';
import { RideService } from '../ride.service';
import { RideSubjectService } from '../ride-subject.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { SettingsService } from '../../settings/settings.service';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './ride-remover.component.html',
  styleUrls: [ './ride-remover.component.scss' ]
})
export class RideRemoverComponent implements OnInit, OnDestroy {
  demoMode: boolean;
  model: any = [];
  user: User = null;

  private availableRides: Array<string> = null;
  private socket: Socket;
  private subscriptions: Array<Subscription> = [];

  constructor(private alertService: AlertService,
              private rideService: RideService,
              private rideSubjectService: RideSubjectService,
              private router: Router,
              private settingsService: SettingsService,
              private socketService: SocketService,
              private userService: UserService) {
    this.demoMode = this.settingsService.demoMode;
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToAvailableRides();
    this.subscribeToUser();
    this.rideService.emitGiveMeAvailableRides();
  }

  deleteRide() {
    this.rideService.deleteRide(this.model.ride).then((ride: Ride) => {
      if ( ride ) {
        this.alertService.success(`The ride ${ride.name} has been deleted.`);
        this.router.navigate([ '/ride/select-action' ])
      } else {
        this.alertService.error("Oops! Something went wrong!");
      }
    })
  }

  logOutFromRide() {
    eval(this.settingsService.storage).removeItem('rpRide');
    this.rideSubjectService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);

    this.socket.emit('leaveRide');
  }

  subscribeToAvailableRides() {
    const sub = this.rideSubjectService.availableRides$.subscribe(availableRides => {
      this.availableRides = availableRides;
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    const sub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    });
  }

}

