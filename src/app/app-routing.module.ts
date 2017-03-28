import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Sec7NodeApiCallComponent } from "./sec7-node-api-call/sec7-node-api-call.component";
import { SocketComponent } from "./socket/socket.component";
import { RidersMapComponent } from "./riders-map/riders-map.component";
import { RidersMap2Component } from "./riders-map2/riders-map2.component";
import { RidersMap3Component } from "./riders-map3/riders-map3.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { LogoutComponent } from "./logout/logout.component";

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
    path: 'socket',
    component: SocketComponent
  },
  {
    path: 'riders-map',
    component: RidersMapComponent
  },
  {
    path: 'riders-map2',
    component: RidersMap2Component
  },
  {
    path: 'riders-map3',
    component: RidersMap3Component
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
