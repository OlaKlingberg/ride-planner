import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
// import { PasswordResetGuard } from './password-reset.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [ NotLoggedInGuard ]
    },
    {
      path: 'logout',
      component: LogoutComponent
    },
    {
      path: 'register',
      component: RegistrationComponent
    },
    {
      path: 'password-reset',
      component: PasswordResetComponent,
      // canActivate: [ PasswordResetGuard ]
    },
    {
      path: 'password-reset-request',
      component: PasswordResetRequestComponent
    }
  ])],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
