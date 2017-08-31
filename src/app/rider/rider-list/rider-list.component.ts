import { Component, OnDestroy, OnInit } from '@angular/core';

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { RideSubjectService } from '../../ride/ride-subject.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { RiderService } from '../rider.service';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  ride: string;
  riderList: Array<User>;
  user: User;

  private rideSub: Subscription;
  private socket: Socket;
  private subscriptions: Array<Subscription> = [];
  private userSub: Subscription;

  constructor(private riderService: RiderService,
              private rideSubjectService: RideSubjectService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToRide();
    this.subscribeToRiderList();
    this.subscribeToUser();
  }

  subscribeToRide() {
    let sub = this.rideSubjectService.ride$.subscribe(ride => {
      this.ride = ride;
    });
    this.subscriptions.push(sub);
  }

  subscribeToRiderList() {
    let sub = this.riderService.riderList$.subscribe(riderList => {
      this.riderList = riderList;
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    let sub = this.userService.user$.subscribe(user => {
      this.user = user;
      if ( user.ride ) this.riderService.emitGiveMeRiderList(user);
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    });
  }

}
