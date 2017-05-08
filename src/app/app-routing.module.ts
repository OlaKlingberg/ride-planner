import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RidersMap2Component } from "./riders-map2/riders-map2.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { LogoutComponent } from "./logout/logout.component";
import { ProtectedComponent } from "./protected/protected.component";
import { AuthGuard } from "./_guards/auth.guard";
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { UserListComponent } from './user-list/user-list.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { AdminGuard } from './_guards/admin.guard';
import { RideLeaderGuard } from './_guards/ride-leader.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'riders-map2',
    component: RidersMap2Component
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    component: ProtectedComponent
  },
  {
    path: 'ride-selector',
    canActivate: [AuthGuard],
    component: RideSelectorComponent
  },
  {
    path: 'members',
    canActivate: [RideLeaderGuard],
    component: UserListComponent
  },
  {
    path: 'riders',
    canActivate: [RideLeaderGuard],
    component: RiderListComponent
  },
  {
    path: 'debugger',
    canActivate: [AdminGuard],
    component: DebuggerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
