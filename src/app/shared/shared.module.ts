import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap';

import { EqualValidator } from './equal-validator.directive';
import { FocusDirective } from './focus.directive';

@NgModule({
  imports: [],
  declarations: [
    EqualValidator,
    FocusDirective,
  ],
  exports: [
    CommonModule,
    EqualValidator,
    FocusDirective,
    FormsModule,
    TooltipModule
  ],
  providers: []
})
export class SharedModule {
}