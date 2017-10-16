import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { MdCardModule, MdCheckboxModule, MdRadioModule, MdSliderModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    MdCheckboxModule,
    MdRadioModule,
    MdSliderModule,
    SettingsRoutingModule,
    SharedModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule {
}
