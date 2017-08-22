import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected.component';

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
