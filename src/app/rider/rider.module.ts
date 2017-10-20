import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RiderListComponent } from './rider-list/rider-list.component';
import { RiderRoutingModule } from './rider-routing.module';
import {
  MdFormFieldModule,
  MdInputModule,
  MdSortModule,
  MdTableModule,
  MdTooltipModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MdFormFieldModule,
    MdInputModule,
    MdSortModule,
    MdTableModule,
    MdTooltipModule,
    SharedModule,
    RiderRoutingModule
  ],
  declarations: [
    RiderListComponent
  ]
})
export class RiderModule {
}