import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2MapModule } from 'ng2-map';

import { RidersMapComponent } from './riders-map.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCq7FfviO3Hm-wCU6K0NhrV8iPEx8u8ywU' })
  ],
  declarations: [
    RidersMapComponent
  ],
  providers: [ ],
  bootstrap: [ ]
})
export class RidersMapModule {
}




