import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { Sec7NodeApiCallComponent } from './sec7-node-api-call/sec7-node-api-call.component';
import { Sec7NodeApiCallService } from "./sec7-node-api-call/sec7-node-api-call.service";
import { AuctionComponent } from './auction/auction.component';
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
import { MapService } from "./_services/map.service";
// import { SocketService } from './_services/socket.service';
import { RideSelectorComponent } from './ride-selector/ride-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    Sec7NodeApiCallComponent,
    AuctionComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    LogoutComponent,
    ProtectedComponent,
    AlertComponent,
    RideSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    RidersMap2Module
  ],
  providers: [
    Sec7NodeApiCallService,
    UserService,
    AuthenticationService,
    AuthGuard,
    AlertService,
    MapService
    // SocketService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
