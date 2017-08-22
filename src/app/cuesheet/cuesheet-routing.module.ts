import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CuesheetListComponent } from './cuesheet-list/cuesheet-list.component';
import { CuesheetNewComponent } from './cuesheet-new/cuesheet-new.component';
import { CuesheetViewComponent } from './cuesheet-view/cuesheet-view.component';
import { CuesheetEditComponent } from './cuesheet-edit/cuesheet-edit.component';
import { CuesheetBikeComponent } from './cuesheet-bike/cuesheet-bike.component';

@NgModule({
  imports: [RouterModule.forChild([
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
      component: CuesheetBikeComponent
    }
  ])],
  exports: [RouterModule]
})
export class CuesheetRoutingModule { }
