import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertService } from "../../alert/alert.service";
import { AuthenticationService } from '../authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user/user.service';
import Socket = SocketIOClient.Socket;
import { MiscService } from '../../core/misc.service';
import { RideSubjectService } from '../../ride/ride-subject.service';

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
              private miscService: MiscService) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.logoutSub = this.authenticationService.logout()
        .subscribe(() => {
              environment.storage.removeItem('rpToken');
              environment.storage.removeItem('rpRide');
              this.userService.user$.next(null);
              this.rideSubjectService.ride$.next(null);

              this.socket.emit('leaveRide');

              this.userService.watchWhenToUpdateUserPosition();
              this.userService.watchWhenToJoinRide();

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
