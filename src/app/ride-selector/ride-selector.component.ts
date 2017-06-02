import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RiderService } from '../_services/rider.service';
import { AlertService } from '../_services/alert.service';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { MiscService } from '../_services/misc.service';
import Socket = SocketIOClient.Socket;
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  private model: any = [];
  private socket: Socket;
  public user: User = null;
  private availableRides: Array<string>;
  private userSub: Subscription;

  constructor(private router: Router,
              private userService: UserService,
              private riderService: RiderService,
              private miscService: MiscService) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.subscribeToUser();
    // this.subscribeToAvailableRides();
    this.getAvailableRides();
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
    this.socket.on('availableRides', availableRides => {
      console.log("availableRides:", availableRides);
      this.availableRides = availableRides;
    });
  }

  onSubmit() {
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
  }

}

