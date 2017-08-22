import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { MiscService } from '../../shared/misc.service';
import Socket = SocketIOClient.Socket;
import { environment } from "../../../environments/environment";

@Component({
  selector: 'rp-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  private model: any = [];
  private socket: Socket;
  public user: User = null;
  private availableRides: Array<string> = null;
  private userSub: Subscription;
  private availableRidesListener: any;

  constructor(private router: Router,
              private userService: UserService,
              private miscService: MiscService) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.subscribeToUser();
    this.getAvailableRides();
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
    this.availableRidesListener = this.socket.on('availableRides', availableRides => {
      if (availableRides.length > 0) this.availableRides = availableRides;
    });
  }

  signIn() {
    this.userService.ride$.next(this.model.ride);
    environment.storage.setItem('rpRide', this.model.ride);
    this.router.navigate(['/map']);
  }

  logOutFromRide() {
    environment.storage.removeItem('rpRide');
    this.userService.ride$.next(null);
    let user: User = this.userService.user$.value;
    user.ride = null;
    this.userService.user$.next(user);
    this.userService.watchWhenToJoinRide();

    this.socket.emit('leaveRide');
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.socket.removeAllListeners();
  }

}

