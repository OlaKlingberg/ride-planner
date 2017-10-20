import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RiderListComponent } from './rider-list/rider-list.component';
import { RiderRoutingModule } from './rider-routing.module';
import {
  MdTooltipModule,
  MdFormFieldModule,
  MdInputModule,
  MdSortModule,
  MdTableModule
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    SharedModule,
    RiderRoutingModule
  ],
  declarations: [
    RiderListComponent
  ]
})
export class RiderModule {
}