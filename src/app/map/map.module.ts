import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MapComponent } from './map.component';
import { AgmCoreModule } from "angular2-google-maps/core";
import { environment } from "../../environments/environment";
import { SharedModule } from '../shared/shared.module';

@NgModule({

  imports: [
    SharedModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],
  declarations: [
    MapComponent
  ],
  providers: [],
  bootstrap: []
})
export class MapModule {
}
