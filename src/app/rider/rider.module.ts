import { NgModule } from '@angular/core';
import { RiderListComponent } from './rider-list/rider-list.component';
import { CommonModule } from '@angular/common';
import { RiderRoutingModule } from './rider-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RiderRoutingModule
  ],
  declarations: [
    RiderListComponent
  ],
  exports: [],
  providers: []
})
export class RiderModule {
}