import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Rider } from '../_models/rider';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../user/user';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { UserService } from '../../user/user.service';
import { SocketService } from '../../core/socket.service';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  public riderList: User[];
  private socket: Socket;
  private userSub: Subscription;
  private rideSub: Subscription;
  public user: User;
  public ride: string;

  constructor(private socketService: SocketService,
              private rideSubjectService: RideSubjectService,
              private userService: UserService,
              private router: Router) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToRide();
    this.subscribeToUser();
  }

  subscribeToRide() {
    this.rideSub = this.rideSubjectService.ride$.subscribe(ride => {
      this.ride = ride;
    })
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
      if (user.ride) this.getRiderList();
    });
  }

  // Todo: Should these functions be moved to RiderService and just be called from here?
  getRiderList() {
    this.socket.emit('giveMeRiderList', this.user.ride);
    this.socket.on('riderList', riderList => {
      riderList = riderList.map(rider => new User(rider));
      this.riderList = riderList;
    });
  }

  // goToRideSelector() {
  //   this.router.navigate([ '/ride-selector' ]);
  // }

  ngOnDestroy() {
    this.rideSub.unsubscribe();
    this.userSub.unsubscribe();
    this.socket.removeAllListeners();
  }

}
