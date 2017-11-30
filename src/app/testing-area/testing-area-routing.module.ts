import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TestingAreaComponent } from './testing-area.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: TestingAreaComponent
    }
  ])],
  exports: []
})
export class TestingAreaRoutingModule { }
