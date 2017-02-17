import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Sec7NodeApiCallComponent } from "./sec7-node-api-call/sec7-node-api-call.component";
import { SocketComponent } from "./socket/socket/socket.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
