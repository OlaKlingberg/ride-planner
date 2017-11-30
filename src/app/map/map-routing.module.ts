import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { MapFrameComponent } from './map-frame/map-frame.component';
import { LargeWindowGuard } from '../core/large-window.guard';
import { SmallWindowGuard } from '../core/small-window.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: MapComponent,
      canActivate: [ SmallWindowGuard ]
    },
    {
      path: 'frame',
      component: MapFrameComponent,
      canActivate: [ LargeWindowGuard ]
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
