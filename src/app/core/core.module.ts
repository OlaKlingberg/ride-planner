import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { RideService } from '../ride/ride.service';
import { AlertModule } from '../alert/alert.module';

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
    RideService,
    UserService
  ]
})
export class CoreModule {
}