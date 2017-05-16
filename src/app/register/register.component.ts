import { Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../_services/user.service";
import { AlertService } from "../_services/alert.service";
import { User } from "../_models/user";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rp-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnDestroy {
  model: any = {};
  loading = false;
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
        .subscribe(
            () => {
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
