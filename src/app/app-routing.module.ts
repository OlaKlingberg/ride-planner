import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Sec7NodeApiCallComponent } from "./sec7-node-api-call/sec7-node-api-call.component";
import { SocketComponent } from "./socket/socket.component";
import { RidersMapComponent } from "./riders-map/riders-map.component";
import { RidersMap2Component } from "./riders-map2/riders-map2.component";

const routes: Routes = [
  {
    path: '',
    children: []
  },
  {
    path: 'sec7-node-api-call',
    component: Sec7NodeApiCallComponent
  },
  {
    path: 'socket',
    component: SocketComponent
  },
  // {
  //   path: 'riders-map',
  //   component: RidersMapComponent
  // },
  {
    path: 'riders-map2',
    component: RidersMap2Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
