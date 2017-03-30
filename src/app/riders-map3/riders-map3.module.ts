import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidersMap3Component } from './riders-map3.component';
import { AgmCoreModule } from "angular2-google-maps/core";

import { environment } from "../../environments/environment";

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],
  declarations: [
      RidersMap3Component
  ]
})
export class RidersMap3Module { }
