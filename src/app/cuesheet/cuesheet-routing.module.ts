import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetBikeDemoComponent } from './cuesheet-bike/cuesheet-bike-demo.component';
import { CuesheetBikeFrameComponent } from './cuesheet-bike-frame/cuesheet-bike-frame.component';
import { CuesheetBikeFrameDemoComponent } from './cuesheet-bike-frame/cuesheet-bike-frame-demo.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetEditDemoComponent } from './cuesheet-edit/cuesheet-edit-demo.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetListDemoComponent } from './cuesheet-list/cuesheet-list-demo.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetNewDemoComponent } from './cuesheet-new/cuesheet-new-demo.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetViewDemoComponent } from './cuesheet-view/cuesheet-view-demo.component';
import { CuesheetEditGuard } from './cuesheetEdit.guard';
import { DemoGuard } from '../core/demo.guard';
import { LargeWindowGuard } from '../core/large-window.guard';
import { SmallWindowGuard } from '../core/small-window.guard';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: CuesheetListComponent,
      canActivate: [ DemoGuard ]
    },
    {
      path: 'demo',
      component: CuesheetListDemoComponent
    },
    {
      path: 'new',
      component: CuesheetNewComponent,
      canActivate: [ DemoGuard ]
    },
    {
      path: 'new/demo',
      component: CuesheetNewDemoComponent
    },
    {
      path: ':id/view',
      component: CuesheetViewComponent,
      canActivate: [ DemoGuard ]
    },
    {
      path: ':id/view/demo',
      component: CuesheetViewDemoComponent
    },
    {
      path: ':id/edit',
      component: CuesheetEditComponent,
      canActivate: [ DemoGuard, CuesheetEditGuard ]
    },
    {
      path: ':id/edit/demo',
      component: CuesheetEditDemoComponent
    },
    {
      path: ':cuesheetId/bike/:cueNumber',
      component: CuesheetBikeComponent,
      canActivate: [ SmallWindowGuard, DemoGuard ]
    },
    {
      path: ':cuesheetId/bike/:cueNumber/demo',
      component: CuesheetBikeDemoComponent,
      canActivate: [ SmallWindowGuard ]
    },
    {
      path: 'frame/:cuesheetId/bike/:cueNumber',
      component: CuesheetBikeFrameComponent,
      canActivate: [ DemoGuard, LargeWindowGuard ]
    },
    {
      path: 'frame/:cuesheetId/bike/:cueNumber/demo',
      component: CuesheetBikeFrameDemoComponent,
      canActivate: [ LargeWindowGuard ]
    }
  ]) ],
  exports: [ RouterModule ],
  providers: [
      DemoGuard,
      SmallWindowGuard,
      LargeWindowGuard
  ]
})
export class CuesheetRoutingModule {
}
