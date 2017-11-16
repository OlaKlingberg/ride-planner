import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatCardModule, MatCheckboxModule, MatRadioModule, MatSliderModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { PageElementsModule } from '../page-elements/page-elements.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    PageElementsModule,
    SettingsRoutingModule,
    SharedModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule {
}
