import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { AlertService } from "../_services/alert.service";
import { RiderService } from '../_services/rider.service';

@Component({
  selector: 'rp-logout',
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private riderService: RiderService) {
  }

  ngOnInit() {
    this.riderService.removeRider();

    this.authenticationService.logout()
        .subscribe(
            () => {
              this.alertService.success('You have been logged out', true);
              this.router.navigate([ '/login' ]);
            },
            error => {
              console.log(error);
            }
        );
  }
}
