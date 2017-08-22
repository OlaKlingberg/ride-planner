import { NgModule } from '@angular/core';
import { FocusDirective } from './focus.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MiscService } from './misc.service';

@NgModule({
  imports: [],
  declarations: [
    FocusDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    FocusDirective
  ],
  providers: [
    MiscService
  ]
})
export class SharedModule {
}