import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AlertService } from "../_services/alert.service";
import { StatusService } from '../_services/status.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'rp-logout',
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private statusService: StatusService) {
  }

  ngOnInit() {
    // this.riderService.removeRider();
    this.statusService.currentRide$.next(null);
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
