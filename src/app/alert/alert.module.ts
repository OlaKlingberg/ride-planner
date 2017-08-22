import { NgModule } from '@angular/core';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports:      [
      CommonModule
  ],
  declarations: [
      AlertComponent
  ],
  exports:      [
      AlertComponent
  ],
  providers:    [
      AlertService
  ]
})
export class AlertModule {
}