import { NgModule } from '@angular/core';
import { RiderListComponent } from './rider-list/rider-list.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RiderListComponent
  ],
  exports: [],
  providers: []
})
export class RiderModule {
}