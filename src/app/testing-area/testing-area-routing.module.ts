import { NgModule } from '@angular/core';
import { TestingAreaComponent } from './testing-area.component';
import { RouterModule } from '@angular/router';

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
