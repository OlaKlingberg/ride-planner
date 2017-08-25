import { NgModule } from '@angular/core';
import { FocusDirective } from './focus.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EqualValidator } from './equal-validator.directive';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [],
  declarations: [
    FocusDirective,
    EqualValidator
  ],
  exports: [
    CommonModule,
    FormsModule,
    EqualValidator,
    FocusDirective,
    TooltipModule
  ],
  providers: []
})
export class SharedModule {
}