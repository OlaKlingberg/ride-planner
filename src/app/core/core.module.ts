import { NgModule } from '@angular/core';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { AlertModule } from '../alert/alert.module';
import { PositionService } from './position.service';
import { RideService } from '../ride/ride.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from './socket.service';
import { NavService } from '../nav/nav.service';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { NavModule } from '../nav/nav.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CuesheetService } from '../cuesheet/cuesheet.service';
import { DebuggingService } from '../debugger/debugging.service';
import { RideLeaderGuard } from '../_guards/ride-leader.guard';
import { AdminGuard } from '../_guards/admin.guard';
import { AuthGuard } from '../_guards/auth.guard';

@NgModule({
  imports: [
    // CommonModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [],
  exports: [
    AlertModule,
    BrowserAnimationsModule,
    HttpModule,
    NavModule
  ],
  providers: [
    AuthenticationService,
    NavService,
    PositionService,
    RideService,        // Todo: Should perhaps be moved to RideModule.
    RideSubjectService, // Todo: Should perhaps be moved to RideModule.
    SocketService,
    UserService,
    AuthGuard,
    AdminGuard,
    RideLeaderGuard,
    DebuggingService,
    CuesheetService
  ]
})
export class CoreModule {
}