import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { AlertService } from "../_services/alert.service";
import { User } from "../_models/user";

import * as $ from 'jquery';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from "app/_services/user.service";

@Component({
  selector: 'rp-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  model: any = {};
  loading = false;
  returnUrl: string;
  user: User;

  loginSub: Subscription;
  userSub: Subscription;

  private counter: number = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private userService: UserService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/ride-selector';

    // console.log("LoginComponent. About to subscribe to user$. Counter:", this.counter++);
    this.userSub = this.userService.user$.subscribe(user => {
          if ( user ) {
            this.user = user;
            this.router.navigate([ this.returnUrl ]);
          }
        }
    );

  }

  login() {
    this.loading = true;
    this.loginSub = this.authenticationService.login(this.model.email.toLowerCase(), this.model.password)
        .subscribe(() => {
              this.alertService.success("You have been successfully logged in!", true);
              console.log("About to navigate to /ride-selector");
              this.router.navigate([ '/ride-selector' ]);
            },
            error => {
              console.log("LoginComponent.login(). There was an error logging in.");
              console.log(error);
              this.alertService.error(error._body);
              this.loading = false;
            }
        )
  }

  // On some phone browsers, the model doesn't sync automatically when a form field is filled in using autocomplete. That's why this function is needed.
  syncModel() {
    this.model.email = $('#email')[0].value;
    this.model.password = $('#password')[0].value;

    return true;
  }

  ngOnDestroy() {
    if (this.loginSub) this.loginSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
  }

}
