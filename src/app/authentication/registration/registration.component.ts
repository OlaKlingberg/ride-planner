import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { AlertService } from "../../alert/alert.service";
import { User } from "../../user/user";
import { UserService } from "../../user/user.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ]
})
export class RegistrationComponent implements OnDestroy {
  model: any = {};
  loading: boolean = false;
  user: User;

  private subscription: Subscription;

  @ViewChild('phoneField') phoneField: ElementRef;
  @ViewChild('emergencyPhoneField') emergencyPhoneField: ElementRef;

  constructor(private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
  }

  formatPhone($event, field) {
    this.model[field] += '.';

    setTimeout(() => {
      // Limit length to 10 digits plus 2 hyphens.
      let ph = $event.substr(0, 12);

      // Remove all non-number characters.
      ph = ph.replace(/\D/g, '');
      let length = ph.length;

      // Add spaces to end so string becomes 10 characters long.
      if (length < 6) ph += Array(7 - length).join(' ');

      // (Re-)insert hyphens into the string.
      ph = `${ph.substr(0, 3)}-${ph.substr(3, 3)}-${ph.substr(6)}`;

      this.model[field] = ph;

      // Set cursor position.
      let pos = length;
      if ( length >= 3 ) pos++;
      if ( length >= 6 ) pos++;
      // If the user deleted a hyphen, put the cursor to the left of the hyphen.
      if ($event.length > 1 && $event.split('-').length !== 3) pos--;
      setTimeout(() => {
        this[field + 'Field'].nativeElement.setSelectionRange(pos, pos);
      }, 0);
    });
  }


  register() {
    this.loading = true;
    this.subscription = this.userService.create(this.model)
        .subscribe(() => {
              this.alertService.success('Registration successful', true);
              this.router.navigate([ '/auth/login' ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            }
        )
  }

  ngOnDestroy() {
    if ( this.subscription ) this.subscription.unsubscribe();
  }
}
