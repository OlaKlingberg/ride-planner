import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { AlertModule } from '../alert/alert.module';
import { PositionService } from './position.service';
import { RideService } from '../ride/ride.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from './socket.service';
import { NavService } from '../nav/nav.service';

@NgModule({
  imports: [
    AlertModule,
    CommonModule
  ],
  declarations: [],
  exports: [
    AlertModule
  ],
  providers: [
    AuthenticationService,
    NavService,
    PositionService,
    RideService,        // Todo: Should perhaps be moved to RideModule.
    RideSubjectService, // Todo: Should perhaps be moved to RideModule.
    SocketService,
    UserService,
  ]
})
export class CoreModule {
}