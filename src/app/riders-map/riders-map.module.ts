import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2MapModule } from 'ng2-map';

import { RidersMapComponent } from './riders-map.component';
import { environment } from "../../environments/environment";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.googleMapsKey })
  ],
  declarations: [
    RidersMapComponent
  ],
  providers: [ ],
  bootstrap: [ ]
})
export class RidersMapModule {
}




