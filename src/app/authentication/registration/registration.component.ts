import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { AlertService } from "../../alert/alert.service";
import { User } from "../../user/user";
import { UserService } from "../../user/user.service";

@Component({
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ]
})
export class RegistrationComponent {
  model: any = {};
  loading: boolean = false;
  user: User;

  constructor(private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
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
}
