import { Component, OnDestroy, OnInit } from '@angular/core';

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { RideSubjectService } from '../../ride/ride-subject.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  ride: string;
  riderList: User[];
  user: User;

  private rideSub: Subscription;
  private socket: Socket;
  private subscriptions: Array<Subscription> = [];
  private userSub: Subscription;

  constructor(private rideSubjectService: RideSubjectService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToRide();
    this.subscribeToUser();
  }


  // Todo: Should these functions be moved to a RiderService?
  getRiderList() {
    this.socket.emit('giveMeRiderList', this.user.ride);
    this.socket.on('riderList', riderList => {
      riderList = riderList.map(rider => new User(rider));
      this.riderList = riderList;
    });
  }

  subscribeToRide() {
    let sub = this.rideSubjectService.ride$.subscribe(ride => {
      this.ride = ride;
    });
    this.subscriptions.push(sub);
  }

  subscribeToUser() {
    let sub = this.userService.user$.subscribe(user => {
      this.user = user;
      if (user.ride) this.getRiderList();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    });

    this.socket.removeAllListeners();
  }

}
