import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map/map.component';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MapFrameComponent } from './map-frame/map-frame.component';

@NgModule({
  imports: [
    AgmCoreModule,
    MapRoutingModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    MapFrameComponent,
    MapComponent
  ]
})
export class MapModule { }
