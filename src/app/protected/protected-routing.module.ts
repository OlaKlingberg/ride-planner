import { NgModule } from '@angular/core';
import { ProtectedComponent } from './protected.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: ProtectedComponent
    }
  ])],
  exports: []
})
export class ProtectedRoutingModule { }
