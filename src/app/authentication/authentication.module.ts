import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PageElementsModule } from '../page-elements/page-elements.module';
import { RegistrationComponent } from './registration/registration.component';
import { SharedModule } from '../shared/shared.module';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
// import { PasswordResetGuard } from './password-reset.guard';

@NgModule({
  imports: [
    AuthenticationRoutingModule,
    PageElementsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    PasswordResetRequestComponent,
    PasswordResetComponent
  ],
  // providers: [
  //   PasswordResetGuard
  // ]
})
export class AuthenticationModule {
}
