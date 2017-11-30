import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { MapComponent } from './map/map.component';
import { MapFrameComponent } from './map-frame/map-frame.component';
import { MapRoutingModule } from './map-routing.module';
import { PageElementsModule } from '../page-elements/page-elements.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AgmCoreModule,
    MapRoutingModule,
    PageElementsModule,
    SharedModule,
    HttpModule
  ],
  declarations: [
    MapComponent,
    MapFrameComponent
  ]
})
export class MapModule {
}
