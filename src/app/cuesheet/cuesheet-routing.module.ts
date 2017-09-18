import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetBikeIframeComponent } from './cuesheet-bike-iframe/cuesheet-bike-iframe.component';
import { WindowSizeGuard } from './window-size.guard';

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: CuesheetListComponent
    },
    {
      path: 'new',
      component: CuesheetNewComponent
    },
    {
      path: ':id/view',
      component: CuesheetViewComponent
    },
    {
      path: ':id/edit',
      component: CuesheetEditComponent
    },
    {
      path: ':cuesheetId/bike/:cueNumber',
      component: CuesheetBikeComponent,
      canActivate: [ WindowSizeGuard ]
    },
    {
      path: ':cuesheetId/bike-iframe/:cueNumber',
      component: CuesheetBikeIframeComponent
    }
  ]) ],
  exports: [ RouterModule ],
  providers: [
      WindowSizeGuard
  ]
})
export class CuesheetRoutingModule {
}
