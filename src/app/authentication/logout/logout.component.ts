import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from "../../alert/alert.service";
import { AuthenticationService } from '../authentication.service';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { SettingsService } from '../../settings/settings.service';
import { SocketService } from '../../core/socket.service';
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
              private settingsService: SettingsService,
              private socketService: SocketService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscription = this.authenticationService.logout()
        .subscribe(() => {
              eval(this.settingsService.storage).removeItem('rpToken');
              eval(this.settingsService.storage).removeItem('rpRide');

              this.rideSubjectService.ride$.next(null);
              this.userService.user$.next(null);

              this.socket.emit('leaveRide');

              this.alertService.success('You have been logged out', true, true);
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
