import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotLoggedInGuard } from './not-logged-in.guard';

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
    }
  ])],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
