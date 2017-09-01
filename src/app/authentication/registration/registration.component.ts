import { Component, OnDestroy } from '@angular/core';
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

  constructor(private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
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
    if (this.subscription) this.subscription.unsubscribe();
  }
}
