import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RidersMap2Component } from './riders-map2.component';
import { AgmCoreModule } from "angular2-google-maps/core";

@NgModule({
  declarations: [
    RidersMap2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok'
    })
  ],
  providers: [ ],
  bootstrap: [ ]
})
export class RidersMap2Module {
}
