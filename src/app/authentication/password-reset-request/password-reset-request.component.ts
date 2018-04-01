import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { AuthenticationService } from '../authentication.service';
import { AlertService } from '../../alert/alert.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './password-reset-request.component.html',
  styleUrls: [ './password-reset-request.component.scss' ]
})
export class PasswordResetRequestComponent implements OnInit {
  model: any = {};

  constructor(private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
  }

  sendResetPasswordRequest() {
    this.authenticationService.sendResetPasswordRequest(this.model.email.toLowerCase())
        .subscribe(message => {
              this.alertService.success(message, false, true);
              this.router.navigate([ '/' ]);
            },
            error => {
              this.alertService.error("Something went wrong. Please try again later.", false, true);
            });
  }

  // On some phone browsers, the model doesn't sync automatically when a form field is filled in using autocomplete. That's why this function is needed.
  syncModel() {
    this.model.email = $('#email')[ 0 ].value;

    return true;
  }

}
