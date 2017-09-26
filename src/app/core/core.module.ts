import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AdminGuard } from '../authentication/admin.guard';
import { AlertModule } from '../alert/alert.module';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthGuard } from '../authentication/auth.guard';
import { CuesheetService } from '../cuesheet/cuesheet.service';
import { DebuggingService } from '../debugger/debugging.service';
import { environment } from '../../environments/environment';
import { NavModule } from '../nav/nav.module';
import { NavService } from '../nav/nav.service';
import { PositionService } from './position.service';
import { RefreshService } from './refresh.service';
import { RideLeaderGuard } from '../ride/ride-leader.guard';
import { RideService } from '../ride/ride.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from './socket.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { UserService } from '../user/user.service';
import { RiderService } from '../rider/rider.service';
import { HeaderModule } from '../header/header.module';
import { CuesheetDemoService } from '../cuesheet/cuesheet-demo.service';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [],
  exports: [
    AgmCoreModule,
    AlertModule,
    BrowserAnimationsModule,
    HeaderModule,
    HttpModule,
    NavModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AlertService,
    AuthenticationService,
    CuesheetDemoService,
    CuesheetService,
    DebuggingService,
    NavService,
    PositionService,
    RefreshService,
    RideLeaderGuard,
    RideService,
    RideSubjectService,
    RiderService,
    SocketService,
    UserService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}