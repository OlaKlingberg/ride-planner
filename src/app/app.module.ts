import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapModule } from "./map/map.module";
import { AuthGuard } from "./_guards/auth.guard";
import { RideLeaderGuard } from './_guards/ride-leader.guard';
import { AdminGuard } from './_guards/admin.guard';
import { DebuggingService } from './debugger/debugging.service';
import { EqualValidator } from './authentication/registration/equal-validator.directive';
import { CuesheetService } from './cuesheet/cuesheet.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';
import { HomeModule } from './home/home.module';
import { ProtectedModule } from './protected/protected.module';
import { AlertModule } from './alert/alert.module';
import { DebuggerModule } from './debugger/debugger.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RideModule } from './ride/ride.module';
import { CuesheetModule } from './cuesheet/cuesheet.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { NavModule } from './nav/nav.module';
import { UserListModule } from './user/user-list/user-list.module';
import { RiderModule } from './rider/rider.module';

@NgModule({
  declarations: [
    AppComponent,
    EqualValidator
  ],
  imports: [
    AlertModule,
    AuthenticationModule,
    CoreModule,
    CuesheetModule,
    DebuggerModule,
    HomeModule,
    NavModule,
    ProtectedModule,
    RideModule,
    RiderModule,
    SharedModule,
    UserListModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    MapModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot()
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
