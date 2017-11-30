import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { DeviceSizeModule } from './device-size/device-size.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    DeviceSizeModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
