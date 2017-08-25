import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthGuard } from "./_guards/auth.guard";
import { RideLeaderGuard } from './_guards/ride-leader.guard';
import { AdminGuard } from './_guards/admin.guard';
import { DebuggingService } from './debugger/debugging.service';
import { CuesheetService } from './cuesheet/cuesheet.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';
import { CoreModule } from './core/core.module';
import { NavModule } from './nav/nav.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NavModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    RideLeaderGuard,
    DebuggingService,
    CuesheetService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
