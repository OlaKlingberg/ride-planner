import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DebuggerComponent } from './debugger.component';
import { DebuggerRoutingModule } from './debugger-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DebuggerRoutingModule,
  ],
  declarations: [
    DebuggerComponent
  ]
})
export class DebuggerModule {
}