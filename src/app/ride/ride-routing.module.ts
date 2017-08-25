import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RideCreatorComponent } from './ride-creator/ride-creator.component';
import { RideRemoverComponent } from './ride-remover/ride-remover.component';
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { RideActionSelectorComponent } from './ride-action-selector/ride-action-selector.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'select-action',
      component: RideActionSelectorComponent
    },
    {
      path: 'create',
      component: RideCreatorComponent
    },
    {
      path: 'delete',
      component: RideRemoverComponent
    },
    {
      path: 'select',
      component: RideSelectorComponent
    }
  ])],
  exports: [RouterModule]
})
export class RideRoutingModule { }
