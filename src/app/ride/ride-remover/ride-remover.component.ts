import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { environment } from "../../../environments/environment";
import { Ride } from '../ride';
import { RideService } from '../ride.service';
import { RideSubjectService } from '../ride-subject.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './ride-remover.component.html',
  styleUrls: [ './ride-remover.component.scss' ]
})
export class RideRemoverComponent implements OnInit, OnDestroy {
  model: any = [];
  user: User = null;

  private availableRides: Array<string> = null;
  private availableRidesListener: any;
  private socket: Socket;
  private subscription: Subscription;

  constructor(private alertService: AlertService,
              private rideService: RideService,
              private rideSubjectService: RideSubjectService,
              private router: Router,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.getAvailableRides();
    this.subscribeToUser();
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

  // Todo: I'm not sure I should be using sockets here.
  getAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
    this.availableRidesListener = this.socket.on('availableRides', availableRides => {
      if ( availableRides.length > 0 ) this.availableRides = availableRides;
    });
  }

  logOutFromRide() {
    environment.storage.removeItem('rpRide');
    this.rideSubjectService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);
    // this.userService.watchWhenToJoinRide();

    this.socket.emit('leaveRide');
  }


  subscribeToUser() {
    this.subscription = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.socket.removeAllListeners();
  }

}

