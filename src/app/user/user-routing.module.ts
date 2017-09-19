import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: MemberListComponent
    }
  ]) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {
}
