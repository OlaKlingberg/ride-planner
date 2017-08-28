import { NgModule } from '@angular/core';

import { RideActionSelectorComponent } from './ride-action-selector/ride-action-selector.component';
import { RideCreatorComponent } from './ride-creator/ride-creator.component';
import { RideRemoverComponent } from './ride-remover/ride-remover.component';
import { RideRoutingModule } from './ride-routing.module';
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { RideService } from './ride.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    RideRoutingModule,
    SharedModule
  ],
  declarations: [
    RideActionSelectorComponent,
    RideCreatorComponent,
    RideRemoverComponent,
    RideSelectorComponent
  ],
  providers: [
      RideService
  ]
})
export class RideModule {
}