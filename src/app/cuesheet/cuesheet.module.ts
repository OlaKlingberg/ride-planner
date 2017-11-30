import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetBikeCueComponent } from './cuesheet-bike-cue/cuesheet-bike-cue.component';
import { CuesheetBikeDemoComponent } from './cuesheet-bike/cuesheet-bike-demo.component';
import { CuesheetBikeFrameComponent } from './cuesheet-bike-frame/cuesheet-bike-frame.component';
import { CuesheetBikeFrameDemoComponent } from './cuesheet-bike-frame/cuesheet-bike-frame-demo.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetEditDemoComponent } from './cuesheet-edit/cuesheet-edit-demo.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetListDemoComponent } from './cuesheet-list/cuesheet-list-demo.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetNewDemoComponent } from './cuesheet-new/cuesheet-new-demo.component';
import { CuesheetRoutingModule } from './cuesheet-routing.module';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetViewDemoComponent } from './cuesheet-view/cuesheet-view-demo.component';
import { PageElementsModule } from '../page-elements/page-elements.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CuesheetRoutingModule,
    PageElementsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    CuesheetBikeComponent,
    CuesheetBikeCueComponent,
    CuesheetBikeDemoComponent,
    CuesheetBikeFrameComponent,
    CuesheetBikeFrameDemoComponent,
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
