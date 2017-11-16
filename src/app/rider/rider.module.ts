import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RiderListComponent } from './rider-list/rider-list.component';
import { RiderRoutingModule } from './rider-routing.module';
import {
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { PageElementsModule } from '../page-elements/page-elements.module';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    PageElementsModule,
    SharedModule,
    RiderRoutingModule
  ],
  declarations: [
    RiderListComponent
  ]
})
export class RiderModule {
}