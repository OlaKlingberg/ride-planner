import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./_guards/auth.guard";
import { RideLeaderGuard } from './_guards/ride-leader.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: 'app/authentication/authentication.module#AuthenticationModule'
  },
  {
    path: 'cuesheet',
    canActivate: [AuthGuard],
    loadChildren: 'app/cuesheet/cuesheet.module#CuesheetModule'
  },
  {
    path: 'debugger',
    canActivate: [AuthGuard],
    loadChildren: 'app/debugger/debugger.module#DebuggerModule'
  },
  {
    path: 'map',
    canActivate: [AuthGuard],
    loadChildren: 'app/map/map.module#MapModule'
  },
  {
    path: 'members',
    canActivate: [RideLeaderGuard],
    loadChildren: 'app/user/user.module#UserModule'
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    loadChildren: 'app/protected/protected.module#ProtectedModule'
  },
  {
    path: 'ride',
    canActivate: [AuthGuard],
    loadChildren: 'app/ride/ride.module#RideModule'
  },
  {
    path: 'riders',
    canActivate: [RideLeaderGuard],
    loadChildren: 'app/rider/rider.module#RiderModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
