import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RiderListComponent } from './rider-list/rider-list.component';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: RiderListComponent
    }
  ]) ],
  exports: [RouterModule]
})
export class RiderRoutingModule {
}
