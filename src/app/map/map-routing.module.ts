import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { LargeWindowGuard } from '../core/large-window.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: MapComponent,
      // canActivate: [ LargeWindowGuard ]
    },
    {
    }
  ])]
})
export class MapRoutingModule { }
