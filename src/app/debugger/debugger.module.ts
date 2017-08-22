import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebuggerComponent } from './debugger.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DebuggerComponent
  ],
  exports: [
    DebuggerComponent
  ],
  providers: []
})
export class DebuggerModule {
}