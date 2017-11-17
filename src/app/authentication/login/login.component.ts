import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';

import { AlertService } from "app/alert/alert.service";
import { AuthenticationService } from "../authentication.service";
import { User } from "../../user/user";
import { UserService } from "app/user/user.service";

import { SettingsService } from '../../settings/settings.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  demoUserEmails: string[];
  demoMode: boolean;
  model: any = {};
  loading = false;
  user: User;

  private returnUrl: string;
  private subscriptions: Array<Subscription> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
    this.demoMode = this.settingsService.demoMode;
  }

  ngOnInit() {
    if ( this.demoMode ) this.getDemoUsers();

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    console.log("LoginComponent. returnUrl:", this.returnUrl);

    let sub = this.userService.user$.subscribe(user => {
          if ( user ) {
            this.user = user;
            this.router.navigate([ this.returnUrl ]);
          }
        }
    );
    this.subscriptions.push(sub);
  }

  getDemoUsers() {
    this.authenticationService.getUnusedDemoUsers().then(demoUserEmails => {
      console.log("demoUsers:", demoUserEmails);
      this.demoUserEmails = demoUserEmails;

      this.model.email = demoUserEmails[0];
      this.model.password = 'secret';
    });
  }

  login() {
    this.loading = true;
    let sub = this.authenticationService.login(this.model.email.toLowerCase(), this.model.password)
        .subscribe(() => {
              this.alertService.success("You have been successfully logged in!", true, true);
              console.log("LoginComponent.login() About to route to:", this.returnUrl);
              this.router.navigate([ this.returnUrl ]);
            },
            error => {
              console.log(error);
              if ( error.status === 401 ) {
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
    this.model.email = $('#email')[ 0 ].value;
    this.model.password = $('#password')[ 0 ].value;

    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      return sub.unsubscribe();
    })
  }
}
