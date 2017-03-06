import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { Ng2MapModule } from 'ng2-map';

import { AppComponent } from './app.component';
import { Sec7NodeApiCallComponent } from './sec7-node-api-call/sec7-node-api-call.component';
import { Sec7NodeApiCallService } from "./sec7-node-api-call/sec7-node-api-call.service";
import { SocketComponent } from './socket/socket.component';
import { RidersMapComponent } from './riders-map/riders-map.component';
import { AgmCoreModule } from "angular2-google-maps/core";
import { RidersMap2Component } from './riders-map2/riders-map2.component';

@NgModule({
  declarations: [
    AppComponent,
    Sec7NodeApiCallComponent,
    SocketComponent,
    RidersMapComponent,
    RidersMap2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok'
    }),
    Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCq7FfviO3Hm-wCU6K0NhrV8iPEx8u8ywU' })
  ],
  providers: [
    Sec7NodeApiCallService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
