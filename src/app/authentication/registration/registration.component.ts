import { Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../user/user.service";
import { AlertService } from "../../alert/alert.service";
import { User } from "../../user/user";
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ]
})
export class RegistrationComponent implements OnDestroy {
  model: any = {};
  loading: boolean = false;
  user: User;

  createSub: Subscription
  ;

  constructor(private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
        .subscribe(() => {
              this.alertService.success('Registration successful', true);
              this.router.navigate([ '/login' ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            }
        )
  }

  ngOnDestroy() {
    if (this.createSub) this.createSub.unsubscribe();
  }

}
