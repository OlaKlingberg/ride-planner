import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

import { AlertService } from "app/alert/alert.service";
import { AuthenticationService } from "../authentication.service";
import { User } from "../../user/user";
import { UserService } from "app/user/user.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  model: any = {};
  loading = false;
  user: User;

  private returnUrl: string;
  private subscriptions: Array<Subscription> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private userService: UserService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // console.log("LoginComponent. About to subscribe to user$. Counter:", this.counter++);
    let sub = this.userService.user$.subscribe(user => {
          if ( user ) {
            this.user = user;
            this.router.navigate([ this.returnUrl ]);
          }
        }
    );
    this.subscriptions.push(sub);
  }

  login() {
    this.loading = true;
    let sub = this.authenticationService.login(this.model.email.toLowerCase(), this.model.password)
        .subscribe(() => {
              this.alertService.success("You have been successfully logged in!", true, true);
              this.router.navigate([ this.returnUrl ]);
            },
            error => {
              console.log(error);
              if (error.status === 401) {
                this.alertService.error(error._body);
              } else {
                this.alertService.error("There was a problem. Please try again later.");
              }
              this.loading = false;
            }
        );
    this.subscriptions.push(sub);
  }

  // On some phone browsers, the model doesn't sync automatically when a form field is filled in using autocomplete. That's why this function is needed.
  syncModel() {
    this.model.email = $('#email')[0].value;
    this.model.password = $('#password')[0].value;

    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    })
  }
}
