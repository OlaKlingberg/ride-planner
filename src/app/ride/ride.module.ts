import { NgModule } from '@angular/core';
import { RideCreatorComponent } from './ride-creator/ride-creator.component';
import { RideActionSelectorComponent } from './ride-action-selector/ride-action-selector.component';
import { RideRemoverComponent } from './ride-remover/ride-remover.component';
import { RideSelectorComponent } from './ride-selector/ride-selector.component';
import { SharedModule } from '../shared/shared.module';
import { RideRoutingModule } from './ride-routing.module';
import { RideService } from './ride.service';

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
  exports: [],
  providers: [
      RideService
  ]
})
export class RideModule {
}