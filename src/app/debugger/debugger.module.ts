import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DebuggerComponent } from './debugger.component';
import { DebuggerRoutingModule } from './debugger-routing.module';
import { PageElementsModule } from '../page-elements/page-elements.module';

@NgModule({
  imports: [
    CommonModule,
    DebuggerRoutingModule,
    PageElementsModule
  ],
  declarations: [
    DebuggerComponent
  ]
})
export class DebuggerModule {
}