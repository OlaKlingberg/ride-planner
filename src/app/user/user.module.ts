import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [
    UserListComponent
  ],
  exports: [],
  providers: []
})
export class UserModule {
}