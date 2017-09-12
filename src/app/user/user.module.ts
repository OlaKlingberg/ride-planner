import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import {
  MdFormFieldModule,
  MdInputModule,
  MdSortModule,
  MdTableModule,
  MdTooltipModule
} from '@angular/material';
import { MemberListComponent } from './member-list/member-list.component';
import { SharedModule } from '../shared/shared.module';

// Todo: Replace MdAutocompleteModule with MdFormFieldModule and MdInputModule, and format the input box.
@NgModule({
  imports: [
    CommonModule,
    MdFormFieldModule,
    MdInputModule,
    MdSortModule,
    MdTableModule,
    MdTooltipModule,
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    MemberListComponent,
    UserListComponent,
  ]
})
export class UserModule {
}