import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from '../../shared/misc.service';
// import { Rider } from '../_models/rider';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

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

  constructor(private miscService: MiscService,
              private userService: UserService,
              private router: Router) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.subscribeToRide();
    this.subscribeToUser();
  }

  subscribeToRide() {
    this.rideSub = this.userService.ride$.subscribe(ride => {
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
