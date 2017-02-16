import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { Sec7NodeApiCallComponent } from './sec7-node-api-call/sec7-node-api-call.component';
import { Sec7NodeApiCallService } from "./sec7-node-api-call/sec7-node-api-call.service";

@NgModule({
  declarations: [
    AppComponent,
    Sec7NodeApiCallComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Sec7NodeApiCallService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
