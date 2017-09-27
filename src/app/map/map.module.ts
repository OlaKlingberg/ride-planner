import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map/map.component';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MapIframeComponent } from './map-iframe/map-iframe.component';

@NgModule({

  imports: [
    AgmCoreModule,
    MapRoutingModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    MapComponent,
    MapIframeComponent
  ]
})
export class MapModule {
}
