import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { MdSortModule, MdTableModule } from '@angular/material';
import { MemberListComponent } from './member-list/member-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MdSortModule,
    MdTableModule,
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