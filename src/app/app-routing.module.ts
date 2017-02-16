import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Sec7NodeApiCallComponent } from "./sec7-node-api-call/sec7-node-api-call.component";

const routes: Routes = [
  {
    path: '',
    children: []
  },
  {
    path: 'sec7-node-api-call',
    component: Sec7NodeApiCallComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
