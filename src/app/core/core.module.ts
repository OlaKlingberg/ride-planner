import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { AlertModule } from '../alert/alert.module';
import { MiscService } from './misc.service';

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
    UserService,
    MiscService
  ]
})
export class CoreModule {
}