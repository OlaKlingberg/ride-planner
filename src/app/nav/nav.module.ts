import { NgModule } from '@angular/core';
import { NavComponent } from './nav.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    NavComponent
  ],
  exports: [
    NavComponent
  ],
  providers: []
})
export class NavModule {
}