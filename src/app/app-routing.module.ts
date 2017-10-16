import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./authentication/auth.guard";
import { RideLeaderGuard } from './ride/ride-leader.guard';
import { SelectivePreloadingStrategy } from './core/selective-preloading-strategy';
import { AdminGuard } from './authentication/admin.guard';

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
    canActivate: [ AuthGuard ],
    loadChildren: 'app/cuesheet/cuesheet.module#CuesheetModule'
  },
  {
    path: 'debugger',
    canActivate: [ AuthGuard ],
    loadChildren: 'app/debugger/debugger.module#DebuggerModule'
  },
  {
    path: 'map',
    canActivate: [ AuthGuard ],
    loadChildren: 'app/map/map.module#MapModule',
    data: { preload: true }
  },
  {
    path: 'members',
    canActivate: [ RideLeaderGuard ],
    loadChildren: 'app/user/user.module#UserModule'
  },
  {
    path: 'protected',
    canActivate: [ AuthGuard ],
    loadChildren: 'app/protected/protected.module#ProtectedModule'
  },
  {
    path: 'ride',
    canActivate: [ AuthGuard ],
    loadChildren: 'app/ride/ride.module#RideModule'
  },
  {
    path: 'riders',
    canActivate: [ RideLeaderGuard ],
    loadChildren: 'app/rider/rider.module#RiderModule'
  },
  {
    path: 'settings',
    canActivate: [ AdminGuard ],
    loadChildren: 'app/settings/settings.module#SettingsModule'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: SelectivePreloadingStrategy
      }
  )],
  exports: [ RouterModule ],
  providers: [
      SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule {
}
