import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { MiscService } from '../../core/misc.service';
import Socket = SocketIOClient.Socket;
import { environment } from "../../../environments/environment";
import { Ride } from '../ride';
import { RideService } from '../ride.service';

@Component({
  templateUrl: './ride-remover.component.html',
  styleUrls: [ './ride-remover.component.scss' ]
})
export class RideRemoverComponent implements OnInit, OnDestroy {
  public model: any = [];
  private socket: Socket;
  public user: User = null;
  private availableRides: Array<string> = null;
  private userSub: Subscription;
  private availableRidesListener: any;

  constructor(private router: Router,
              private alertService: AlertService,
              private userService: UserService,
              private rideService: RideService,
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

  // Todo: I'm not sure i should be using sockets here.
  getAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
    this.availableRidesListener = this.socket.on('availableRides', availableRides => {
      if ( availableRides.length > 0 ) this.availableRides = availableRides;
    });
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

