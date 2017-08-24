import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { AlertModule } from '../alert/alert.module';
import { MiscService } from './misc.service';
import { PositionService } from './position.service';
import { RideService } from '../ride/ride.service';
import { RideSubjectService } from '../ride/ride-subject.service';

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
    PositionService,
    UserService,
    RideService,
    RideSubjectService,
    MiscService
  ]
})
export class CoreModule {
}