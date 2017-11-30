import { NgModule } from '@angular/core';

import { PageElementsModule } from '../page-elements/page-elements.module';
import { TestingAreaComponent } from './testing-area.component';
import { TestingAreaRoutingModule } from './testing-area-routing.module';

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