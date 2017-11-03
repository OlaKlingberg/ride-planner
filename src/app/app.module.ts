import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DeviceSizeComponent } from './device-size/device-size.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    DeviceSizeComponent,
    FooterComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
