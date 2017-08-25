import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertService } from "../../alert/alert.service";
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user/user.service';
import Socket = SocketIOClient.Socket;
import { RideSubjectService } from '../../ride/ride-subject.service';
import { SocketService } from '../../core/socket.service';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent implements OnInit, OnDestroy {
  private logoutSub: Subscription;
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
    console.log("LogOutComponent.ngOnInit()");
    this.logoutSub = this.authenticationService.logout()
        .subscribe(() => {
              console.log("LogOutComponent. authenticationService has logged out!");

              environment.storage.removeItem('rpToken');
              environment.storage.removeItem('rpRide');

              this.rideSubjectService.ride$.next(null);

              this.userService.user$.next(null);
              // this.userService.makeUserPromise(); // Todo: I hate this. There has to be a better way.

              this.userService.watchWhenToUpdateUserPosition();
              this.userService.watchWhenToJoinRide();

              this.socket.emit('leaveRide');

              console.log("Just emitted leaveRide");

              this.alertService.success('You have been logged out', true);
              this.router.navigate([ '/auth/login' ]);
            },
            error => {
              console.log(error);
            }
        );
  }

  ngOnDestroy() {
    this.logoutSub.unsubscribe();
  }

}
