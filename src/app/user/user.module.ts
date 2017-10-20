import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import {
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { MemberListComponent } from './member-list/member-list.component';
import { SharedModule } from '../shared/shared.module';

// Todo: Replace MdAutocompleteModule with MdFormFieldModule and MdInputModule, and format the input box.
@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    MemberListComponent
  ]
})
export class UserModule {
}