import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

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
  ],
  exports: [],
  providers: []
})
export class AuthenticationModule {
}