import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({

  imports: [
    AgmCoreModule,
    MapRoutingModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    MapComponent
  ]
})
export class MapModule {
}
