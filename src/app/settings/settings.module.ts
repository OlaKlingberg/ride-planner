import { CommonModule } from '@angular/common';
import { MatCardModule, MatCheckboxModule, MatRadioModule, MatSliderModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { PageElementsModule } from '../page-elements/page-elements.module';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';

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
