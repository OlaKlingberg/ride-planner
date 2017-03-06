import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from '../app-routing.module';

import { Ng2MapModule } from 'ng2-map';

import { RidersMap2Component } from '../riders-map2/riders-map2.component';

@NgModule({
  declarations: [
    RidersMap2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCq7FfviO3Hm-wCU6K0NhrV8iPEx8u8ywU' })
  ],
  providers: [ ],
  bootstrap: [ ]
})
export class RidersMap2Module {
}
