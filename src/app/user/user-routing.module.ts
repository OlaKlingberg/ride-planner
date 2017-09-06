import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: UserListComponent
    },
    {
      path: 'members',
      component: MemberListComponent
    }
  ]) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {
}
