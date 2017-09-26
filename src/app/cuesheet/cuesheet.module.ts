import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetBikeIframeComponent } from './cuesheet-bike-iframe/cuesheet-bike-iframe.component';
import { CuesheetBikeCueComponent } from './cuesheet-bike-cue/cuesheet-bike-cue.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetRoutingModule } from './cuesheet-routing.module';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { SharedModule } from '../shared/shared.module';
import { CuesheetEditDemoComponent } from './cuesheet-edit/cuesheet-edit-demo.component';
import { CuesheetViewDemoComponent } from './cuesheet-view/cuesheet-view-demo.component';
import { CuesheetListDemoComponent } from './cuesheet-list/cuesheet-list-demo.component';
import { CuesheetNewDemoComponent } from './cuesheet-new/cuesheet-new-demo.component';

@NgModule({
  imports: [
    CuesheetRoutingModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CuesheetBikeComponent,
    CuesheetBikeCueComponent,
    CuesheetBikeIframeComponent,
    CuesheetEditComponent,
    CuesheetEditDemoComponent,
    CuesheetListComponent,
    CuesheetListDemoComponent,
    CuesheetNewComponent,
    CuesheetNewDemoComponent,
    CuesheetViewComponent,
    CuesheetViewDemoComponent
  ]
})
export class CuesheetModule {
}
