import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { environment } from "../../../environments/environment";
import { RideSubjectService } from '../ride-subject.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  model: any = [];
  user: User = null;

  private availableRides: Array<string> = null;
  private availableRidesListener: any;
  private socket: Socket;
  private userSub: Subscription;

  constructor(private rideSubjectService: RideSubjectService,
              private router: Router,
              private userService: UserService,
              private socketService: SocketService,) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.getAvailableRides();
    this.subscribeToUser();
  }

  getAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
    this.availableRidesListener = this.socket.on('availableRides', availableRides => {
      if ( availableRides.length > 0 ) this.availableRides = availableRides;
    });
  }


  logOutFromRide() {
    this.socket.emit('leaveRide');
    environment.storage.removeItem('rpRide');
    this.rideSubjectService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);
  }

  signIn() {
    this.rideSubjectService.ride$.next(this.model.ride);
    environment.storage.setItem('rpRide', this.model.ride);
    this.router.navigate([ '/map' ]);
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.socket.removeAllListeners();
  }

}

