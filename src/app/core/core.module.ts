import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AdminGuard } from '../_guards/admin.guard';
import { AlertModule } from '../alert/alert.module';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthGuard } from '../_guards/auth.guard';
import { CuesheetService } from '../cuesheet/cuesheet.service';
import { DebuggingService } from '../debugger/debugging.service';
import { environment } from '../../environments/environment';
import { MapService } from '../map/map.service';
import { NavModule } from '../nav/nav.module';
import { NavService } from '../nav/nav.service';
import { PositionService } from './position.service';
import { RefreshService } from './refresh.service';
import { RideLeaderGuard } from '../_guards/ride-leader.guard';
import { RideService } from '../ride/ride.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from './socket.service';
import { throwIfAlreadyLoaded } from '../_guards/module-import-guard';
import { UserService } from '../user/user.service';
import { RiderService } from '../rider/rider.service';

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
    HttpModule,
    NavModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AlertService,
    AuthenticationService,
    CuesheetService,
    DebuggingService,
    MapService,
    NavService,
    PositionService,
    RefreshService,
    RideLeaderGuard,
    RideService,        // Todo: Should perhaps be moved to RideModule.
    RideSubjectService, // Todo: Should perhaps be moved to RideModule.
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