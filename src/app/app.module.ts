import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MapModule } from "./map/map.module";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from "./_services/user.service";
import { AuthenticationService } from "./_services/authentication.service";
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from "./_guards/auth.guard";
import { AlertComponent } from './alert/alert.component';
import { AlertService } from "./_services/alert.service";
import { RiderService } from "./_services/rider.service";
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { UserListComponent } from './user-list/user-list.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { MiscService } from './_services/misc.service';
import { DebuggerComponent } from './debugger/debugger.component';
import { RideLeaderGuard } from './_guards/ride-leader.guard';
import { AdminGuard } from './_guards/admin.guard';
import { DebuggingService } from './_services/debugging.service';
import { WindowRefService } from './_services/window-ref.service';
import { EqualValidator } from './register/equal-validator.directive';
import { ValuesPipe } from './_pipes/values.pipe';
import { CuesheetComponent } from './cuesheet/cuesheet.component';
import { CuesheetService } from './_services/cuesheet.service';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CuesheetCueComponent } from './cuesheet-cue/cuesheet-cue.component';
import { RideCreatorComponent } from './ride-creator/ride-creator.component';
import { RideService } from './_services/ride.service';
import { RideRemoverComponent } from './ride-remover/ride-remover.component';
import { RideActionSelectorComponent } from './ride-action-selector/ride-action-selector.component';
import { FocusDirective } from './_directives/focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    HomeComponent,
    LogoutComponent,
    ProtectedComponent,
    AlertComponent,
    RideSelectorComponent,
    UserListComponent,
    RiderListComponent,
    DebuggerComponent,
    EqualValidator,
    ValuesPipe,
    CuesheetComponent,
    CuesheetListComponent,
    CuesheetNewComponent,
    CuesheetEditComponent,
    CuesheetBikeComponent,
    CuesheetCueComponent,
    RideCreatorComponent,
    RideRemoverComponent,
    RideActionSelectorComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MapModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot()
  ],
  providers: [
    UserService,
    AuthenticationService,
    AuthGuard,
    AdminGuard,
    RideLeaderGuard,
    AlertService,
    RideService,
    RiderService,
    MiscService,
    DebuggingService,
    WindowRefService,
    CuesheetService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
