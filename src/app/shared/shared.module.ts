import { NgModule } from '@angular/core';
import { FocusDirective } from './focus.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MiscService } from './misc.service';
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
  providers: [
    MiscService
  ]
})
export class SharedModule {
}