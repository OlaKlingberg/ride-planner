import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetCueComponent } from './cuesheet-cue/cuesheet-cue.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetRoutingModule } from './cuesheet-routing.module';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { SharedModule } from '../shared/shared.module';
import { CuesheetBikeIframeComponent } from './cuesheet-bike-iframe/cuesheet-bike-iframe.component';

@NgModule({
  imports: [
      CuesheetRoutingModule,
      RouterModule,
      SharedModule
  ],
  declarations: [
      CuesheetBikeComponent,
      CuesheetCueComponent,
      CuesheetEditComponent,
      CuesheetListComponent,
      CuesheetNewComponent,
      CuesheetViewComponent,
      CuesheetBikeIframeComponent
  ]
})
export class CuesheetModule { }
