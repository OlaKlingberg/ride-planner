import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { Sec7NodeApiCallComponent } from './sec7-node-api-call/sec7-node-api-call.component';
import { Sec7NodeApiCallService } from "./sec7-node-api-call/sec7-node-api-call.service";
import { SocketComponent } from './socket/socket.component';
import { RidersMapModule } from './riders-map/riders-map.module';
import { RidersMap2Module } from "./riders-map2/riders-map2.module";
import { RidersMap3Module } from './riders-map3/riders-map3.module';

@NgModule({
  declarations: [
    AppComponent,
    Sec7NodeApiCallComponent,
    SocketComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    RidersMapModule,
    RidersMap2Module,
    RidersMap3Module
  ],
  providers: [
    Sec7NodeApiCallService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
