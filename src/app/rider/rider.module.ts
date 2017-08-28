import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RiderListComponent } from './rider-list/rider-list.component';
import { RiderRoutingModule } from './rider-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RiderRoutingModule
  ],
  declarations: [
    RiderListComponent
  ]
})
export class RiderModule {
}