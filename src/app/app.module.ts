import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RidersMap2Module } from "./riders-map2/riders-map2.module";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from "./_services/user.service";
import { AuthenticationService } from "./_services/authentication.service";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from "./_guards/auth.guard";
import { AlertComponent } from './alert/alert.component';
import { AlertService } from "./_services/alert.service";
import { RideService } from './_services/ride.service';
import { RiderService } from "./_services/rider.service";
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { UserListComponent } from './user-list/user-list.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { StatusService } from './_services/status.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    LogoutComponent,
    ProtectedComponent,
    AlertComponent,
    RideSelectorComponent,
    UserListComponent,
    RiderListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    RidersMap2Module
  ],
  providers: [
    UserService,
    AuthenticationService,
    AuthGuard,
    AlertService,
    RideService,
    RiderService,
    StatusService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
