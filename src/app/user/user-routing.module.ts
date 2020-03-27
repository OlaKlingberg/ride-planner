import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { MemberProfileEditComponent } from './member-profile-edit/member-profile-edit.component';
import { RideLeaderGuard } from '../ride/ride-leader.guard';
import { AdminOrSelfGuard } from '../authentication/admin-or-self.guard';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      canActivate: [ RideLeaderGuard ],
      component: MemberListComponent
    },
    {
      path: ':id',
      canActivate: [ AdminOrSelfGuard ],
      component: MemberProfileComponent
    },
    {
      path: ':id/edit',
      canActivate: [ AdminOrSelfGuard ],
      component: MemberProfileEditComponent
    }
  ]) ],
  exports: [ RouterModule ]
})

export class UserRoutingModule {
}
