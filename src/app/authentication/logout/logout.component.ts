import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from "../../alert/alert.service";
import { AuthenticationService } from '../authentication.service';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { SocketService } from '../../core/socket.service';import { environment } from '../../../environments/environment';
import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private socket: Socket;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private rideSubjectService: RideSubjectService,
              private userService: UserService,
              private socketService: SocketService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscription = this.authenticationService.logout()
        .subscribe(() => {

              environment.storage.removeItem('rpToken');
              environment.storage.removeItem('rpRide');

              this.rideSubjectService.ride$.next(null);

              this.userService.user$.next(null);
              // this.userService.makeUserPromise(); // Todo: I hate this. There has to be a better way.

              // this.userService.watchWhenToUpdateUserPosition();
              // this.userService.watchWhenToJoinRide();

              this.socket.emit('leaveRide');


              this.alertService.success('You have been logged out', true);
              this.router.navigate([ '/auth/login' ]);
            },
            error => {
              console.log(error);
            }
        );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
