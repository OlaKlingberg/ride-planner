import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegistrationComponent
  ]
})
export class AuthenticationModule { }
