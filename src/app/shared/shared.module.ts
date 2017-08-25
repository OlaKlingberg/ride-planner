import { NgModule } from '@angular/core';
import { FocusDirective } from './focus.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EqualValidator } from './equal-validator.directive';

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
    FocusDirective
  ],
  providers: []
})
export class SharedModule {
}