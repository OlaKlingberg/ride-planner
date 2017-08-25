import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebuggerComponent } from './debugger.component';
import { DebuggerRoutingModule } from './debugger-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DebuggerRoutingModule,
  ],
  declarations: [
    DebuggerComponent
  ],
  exports: [],
  providers: []
})
export class DebuggerModule {
}