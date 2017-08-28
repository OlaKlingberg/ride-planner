// Based on the tutorial:
//    https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2

import { Attribute, Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[rpValidateEqual][formControlName],[rpValidateEqual][formControl],[rpValidateEqual][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
  ]
})
export class EqualValidator implements Validator {
  constructor( @Attribute('rpValidateEqual') public rpValidateEqual: string,
               @Attribute('reverse') public reverse: string) {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    let v = c.value;

    // control value
    let e = c.root.get(this.rpValidateEqual);

    // value not equal
    if (e && v !== e.value && !this.isReverse) {
      return {
        rpValidateEqual: false
      }
    }

    // value equal and reverse
    if (e && v === e.value && this.isReverse) {
      delete e.errors['rpValidateEqual'];
      if (!Object.keys(e.errors).length) e.setErrors(null);
    }

    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      e.setErrors({
        rpValidateEqual: false
      })
    }

    return null;
  }

  private get isReverse() {
    if (!this.reverse) return false;
    return this.reverse === 'true' ? true: false;
  }
}