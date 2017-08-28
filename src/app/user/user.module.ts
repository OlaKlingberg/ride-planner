import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [
    UserListComponent
  ]
})
export class UserModule {
}