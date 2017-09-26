import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetBikeIframeComponent } from './cuesheet-bike-iframe/cuesheet-bike-iframe.component';
import { WindowSizeGuard } from './window-size.guard';
import { JaneDoeGuard } from './jane-doe.guard';
import { CuesheetEditDemoComponent } from './cuesheet-edit/cuesheet-edit-demo.component';
import { CuesheetViewDemoComponent } from './cuesheet-view/cuesheet-view-demo.component';
import { CuesheetListDemoComponent } from './cuesheet-list/cuesheet-list-demo.component';
import { CuesheetNewDemoComponent } from './cuesheet-new/cuesheet-new-demo.component';
import { CuesheetBikeIframeDemoComponent } from './cuesheet-bike-iframe/cuesheet-bike-iframe-demo.component';
import { CuesheetBikeDemoComponent } from './cuesheet-bike/cuesheet-bike-demo.component';

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
      canActivate: [ WindowSizeGuard, JaneDoeGuard ]
    },
    {
      path: ':cuesheetId/bike/:cueNumber/demo',
      component: CuesheetBikeDemoComponent
    },
    {
      path: ':cuesheetId/bike-iframe/:cueNumber',
      component: CuesheetBikeIframeComponent,
      canActivate: [ JaneDoeGuard ]
    },
    {
      path: ':cuesheetId/bike-iframe/:cueNumber/demo',
      component: CuesheetBikeIframeDemoComponent
    }
  ]) ],
  exports: [ RouterModule ],
  providers: [
      JaneDoeGuard,
      WindowSizeGuard
  ]
})
export class CuesheetRoutingModule {
}
