import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map/map.component';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MapFrameComponent } from './map-frame/map-frame.component';
import { PageElementsModule } from '../page-elements/page-elements.module';

@NgModule({
  imports: [
    AgmCoreModule,
    MapRoutingModule,
    PageElementsModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    MapFrameComponent,
    MapComponent
  ]
})
export class MapModule {
}
