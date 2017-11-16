import { NgModule } from '@angular/core';

import { TestingAreaComponent } from './testing-area.component';
import { TestingAreaRoutingModule } from './testing-area-routing.module';
import { PageElementsModule } from '../page-elements/page-elements.module';

@NgModule({
  imports: [
      PageElementsModule,
      TestingAreaRoutingModule
  ],
  declarations: [
    TestingAreaComponent
  ]
})
export class TestingAreaModule {
}