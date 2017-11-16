import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSizeComponent } from './device-size.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DeviceSizeComponent
  ],
  exports: [
    DeviceSizeComponent
  ]
})
export class DeviceSizeModule {
}
