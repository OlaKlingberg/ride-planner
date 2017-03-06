import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RidersMapComponent } from '../riders-map/riders-map.component';
import { AgmCoreModule } from "angular2-google-maps/core";

@NgModule({
  declarations: [
    RidersMapComponent
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
export class RidersMapModule {
}
