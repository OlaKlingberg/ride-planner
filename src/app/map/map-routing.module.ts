import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { LargeWindowGuard } from '../core/large-window.guard';
import { MapIframeComponent } from './map-iframe/map-iframe.component';
import { SmallWindowGuard } from '../core/small-window.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: MapComponent,
      canActivate: [ LargeWindowGuard ]
    },
    {
      path: 'iframe',
      component: MapIframeComponent,
      canActivate: [ SmallWindowGuard ]
    }
  ])],
  exports: [
      RouterModule
  ],
  providers: [
      LargeWindowGuard,
      SmallWindowGuard
  ]
})
export class MapRoutingModule { }
