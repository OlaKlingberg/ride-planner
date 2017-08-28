import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from "angular2-google-maps/core";

import { environment } from "../../environments/environment";
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({

  imports: [
    MapRoutingModule,
    SharedModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],
  declarations: [
    MapComponent
  ]
})
export class MapModule {
}
