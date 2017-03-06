import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidersMap3Component } from './riders-map3.component';
import { AgmCoreModule } from "angular2-google-maps/core";

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok'
    })
  ],
  declarations: [
      RidersMap3Component
  ]
})
export class RidersMap3Module { }
