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
import { PageElementsModule } from '../page-elements/page-elements.module';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { MemberProfileEditComponent } from './member-profile-edit/member-profile-edit.component';

// Todo: Replace MdAutocompleteModule with MdFormFieldModule and MdInputModule, and format the input box.
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
    UserRoutingModule
  ],
  declarations: [
    MemberListComponent,
    MemberProfileComponent,
    MemberProfileEditComponent
  ]
})
export class UserModule {
}