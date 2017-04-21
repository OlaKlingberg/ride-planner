import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { AlertService } from "../_services/alert.service";
import { User } from "../_models/user";
import { RiderService } from "../_services/rider.service";

@Component({
  selector: 'rp-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  user: User;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';
    // this.returnUrl = '/ride-selector';

    this.authenticationService.user$.subscribe(
        data => {
          if ( data ) {
            this.user = data.user;
            this.router.navigate([ this.returnUrl ]);
          }
        }
    );
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
        .subscribe(() => {
              this.alertService.success("You have been successfully logged in!", true);
              this.router.navigate([ '/ride-selector' ])
            },
            error => {
              console.log(error);
              this.alertService.error(error._body);
              this.loading = false;
            }
        )

  }

}
