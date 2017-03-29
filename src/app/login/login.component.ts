import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";


@Component({
  selector: 'rp-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // Log out (if logged in).
    this.authenticationService.logout();

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';
  }

  login() {
    this.loading = true;
    // this.authenticationService.login(this.model.email, this.model.password)
    this.authenticationService.login(this.model.email, this.model.password)
        .subscribe(data => {
            this.router.navigate([ this.returnUrl ])
          },
          error => {
            // this.alertService.error(error._body);
            this.loading = false;
          },
          () => {}
        )

  }

}
