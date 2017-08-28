import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DebuggerComponent } from './debugger.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DebuggerComponent }
  ])],
  exports: [RouterModule]
})
export class DebuggerRoutingModule { }