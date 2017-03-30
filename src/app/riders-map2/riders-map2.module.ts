import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RidersMap2Component } from './riders-map2.component';
import { AgmCoreModule } from "angular2-google-maps/core";
import { environment } from "../../environments/environment";

@NgModule({

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],
  declarations: [
    RidersMap2Component
  ],
  providers: [ ],
  bootstrap: [ ]
})
export class RidersMap2Module {
}
