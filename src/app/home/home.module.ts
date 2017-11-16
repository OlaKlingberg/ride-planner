import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PageElementsModule } from '../page-elements/page-elements.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports:      [
      HomeRoutingModule,
      PageElementsModule,
      SharedModule
  ],
  declarations: [
      HomeComponent
  ]
})
export class HomeModule { }