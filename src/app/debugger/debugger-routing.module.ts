import { RouterModule } from '@angular/router';
import { DebuggerComponent } from './debugger.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DebuggerComponent }
  ])],
  exports: [RouterModule]
})
export class DebuggerRoutingModule { }