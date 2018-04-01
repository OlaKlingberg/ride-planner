import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { MemberProfileEditComponent } from './member-profile-edit/member-profile-edit.component';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: MemberListComponent
    },
    {
      path: ':id',
      component: MemberProfileComponent
    },
    {
      path: ':id/edit',
      component: MemberProfileEditComponent
    }
  ]) ],
  exports: [ RouterModule ]
})

export class UserRoutingModule {
}
