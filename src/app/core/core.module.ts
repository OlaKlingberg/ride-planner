import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { RideService } from '../ride/ride.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
    AuthenticationService,
    RideService,
    UserService
  ]
})
export class CoreModule {
}