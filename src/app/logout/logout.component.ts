import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { AlertService } from "../_services/alert.service";

@Component({
  selector: 'rp-logout',
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.authenticationService.logout()
        .subscribe(
            data => {
              this.alertService.success('You have been logged out', true)
              this.router.navigate([ '/' ]);
            },
            error => {

            }
        );
  }

}
