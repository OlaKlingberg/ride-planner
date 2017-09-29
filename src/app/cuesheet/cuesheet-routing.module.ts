import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeFrameComponent } from './cuesheet-bike-frame/cuesheet-bike-frame.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { LargeWindowGuard } from '../core/large-window.guard';
import { JaneDoeGuard } from './jane-doe.guard';
import { CuesheetEditDemoComponent } from './cuesheet-edit/cuesheet-edit-demo.component';
import { CuesheetViewDemoComponent } from './cuesheet-view/cuesheet-view-demo.component';
import { CuesheetListDemoComponent } from './cuesheet-list/cuesheet-list-demo.component';
import { CuesheetNewDemoComponent } from './cuesheet-new/cuesheet-new-demo.component';
import { CuesheetBikeDemoComponent } from './cuesheet-bike/cuesheet-bike-demo.component';
import { CuesheetBikeFrameDemoComponent } from './cuesheet-bike-frame/cuesheet-bike-frame-demo.component';
import { SmallWindowGuard } from '../core/small-window.guard';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: CuesheetListComponent,
      canActivate: [ JaneDoeGuard ]
    },
    {
      path: 'demo',
      component: CuesheetListDemoComponent
    },
    {
      path: 'new',
      component: CuesheetNewComponent,
      canActivate: [ JaneDoeGuard ]
    },
    {
      path: 'new/demo',
      component: CuesheetNewDemoComponent
    },
    {
      path: ':id/view',
      component: CuesheetViewComponent,
      canActivate: [ JaneDoeGuard ]
    },
    {
      path: ':id/view/demo',
      component: CuesheetViewDemoComponent
    },
    {
      path: ':id/edit',
      component: CuesheetEditComponent,
      canActivate: [ JaneDoeGuard ]
    },
    {
      path: ':id/edit/demo',
      component: CuesheetEditDemoComponent
    },
    {
      path: ':cuesheetId/bike/:cueNumber',
      component: CuesheetBikeComponent,
      canActivate: [ SmallWindowGuard, JaneDoeGuard ]
    },
    {
      path: ':cuesheetId/bike/:cueNumber/demo',
      component: CuesheetBikeDemoComponent,
      canActivate: [ SmallWindowGuard ]
    },
    {
      path: 'frame/:cuesheetId/bike/:cueNumber',
      component: CuesheetBikeFrameComponent,
      canActivate: [ JaneDoeGuard, LargeWindowGuard ]
    },
    {
      path: 'frame/:cuesheetId/bike/:cueNumber/demo',
      component: CuesheetBikeFrameDemoComponent,
      canActivate: [ LargeWindowGuard ]
    }
  ]) ],
  exports: [ RouterModule ],
  providers: [
      JaneDoeGuard,
      SmallWindowGuard,
      LargeWindowGuard
  ]
})
export class CuesheetRoutingModule {
}
