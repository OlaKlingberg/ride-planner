import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  templateUrl: './password-reset.component.html',
  styleUrls: [ './password-reset.component.scss' ]
})
export class PasswordResetComponent implements OnInit {
  loading = false;
  model: any = {};

  private email;
  private token;

  constructor(private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
    this.email = route.snapshot.queryParams.email;
    this.token = route.snapshot.queryParams.token;
  }

  ngOnInit() {
  }

  resetPassword() {
    this.loading = true;
    this.authenticationService.resetPassword(this.email, this.token, this.model.password)
        .subscribe(message => {
              this.alertService.success(message, false, true);
              this.router.navigate([ '/auth/login' ]);
            },
            error => {
              this.loading = false;
              this.alertService.error("Something went wrong. Please try again later.", false, true);
            })
  }

}
