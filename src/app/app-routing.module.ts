import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Sec7NodeApiCallComponent } from "./sec7-node-api-call/sec7-node-api-call.component";
import { AuctionComponent } from "./auction/auction.component";
import { RidersMap2Component } from "./riders-map2/riders-map2.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { LogoutComponent } from "./logout/logout.component";
import { ProtectedComponent } from "./protected/protected.component";
import { AuthGuard } from "./_guards/auth.guard";
import { RideSelectorComponent } from './ride-selector/ride-selector.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'sec7-node-api-call',
    component: Sec7NodeApiCallComponent
  },
  {
    path: 'auction',
    component: AuctionComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
