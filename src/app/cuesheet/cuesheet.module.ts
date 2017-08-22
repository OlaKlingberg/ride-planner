import { NgModule } from '@angular/core';
import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetCueComponent } from './cuesheet-cue/cuesheet-cue.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
      RouterModule,
      SharedModule
  ],
  declarations: [
      CuesheetBikeComponent,
      CuesheetCueComponent,
      CuesheetEditComponent,
      CuesheetListComponent,
      CuesheetNewComponent,
      CuesheetViewComponent
  ],
  exports: [],
  providers: []
})
export class CuesheetModule { }