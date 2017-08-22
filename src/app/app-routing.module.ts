import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { LoginComponent } from "./authentication/login/login.component";
import { RegistrationComponent } from "./authentication/registration/registration.component";
import { HomeComponent } from "./home/home.component";
import { LogoutComponent } from "./authentication/logout/logout.component";
import { ProtectedComponent } from "./protected/protected.component";
import { AuthGuard } from "./_guards/auth.guard";
import { RideSelectorComponent } from './ride/ride-selector/ride-selector.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { AdminGuard } from './_guards/admin.guard';
import { RideLeaderGuard } from './_guards/ride-leader.guard';
import { CuesheetViewComponent } from './cuesheet/cuesheet-view/cuesheet-view.component';
import { CuesheetListComponent } from './cuesheet/cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet/cuesheet-new/cuesheet-new.component';
import { CuesheetEditComponent } from './cuesheet/cuesheet-edit/cuesheet-edit.component';
import { CuesheetBikeComponent } from './cuesheet/cuesheet-bike/cuesheet-bike.component';
import { RideCreatorComponent } from './ride/ride-creator/ride-creator.component';
import { RideRemoverComponent } from './ride/ride-remover/ride-remover.component';
import { RideActionSelectorComponent } from './ride/ride-action-selector/ride-action-selector.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'map',
    canActivate: [AuthGuard],
    component: MapComponent
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
    component: RegistrationComponent
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
    path: 'ride-creator',
    canActivate: [AuthGuard],
    component: RideCreatorComponent
  },
  {
    path: 'ride-remover',
    canActivate: [AuthGuard],
    component: RideRemoverComponent
  },
  {
    path: 'ride-action-selector',
    canActivate: [AuthGuard],
    component: RideActionSelectorComponent
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
  },
  {
    path: 'cuesheets',
    canActivate: [AuthGuard],
    component: CuesheetListComponent
  },
  {
    path: 'cuesheets/new',
    canActivate: [AuthGuard],
    component: CuesheetNewComponent
  },
  {
    path: 'cuesheets/:_id/view',
    canActivate: [AuthGuard],
    component: CuesheetViewComponent
  },
  {
    path: 'cuesheets/:_id/edit',
    canActivate: [AuthGuard],
    component: CuesheetEditComponent
  },
  {
    path: 'cuesheets/:cuesheetId/bike/:cueNumber',
    canActivate: [AuthGuard],
    component: CuesheetBikeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
