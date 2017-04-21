import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { RiderService } from '../_services/rider.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit {
  public model: any = [];
  private selectedRide: string;

  constructor(private router: Router,
              private riderService: RiderService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.selectedRide = localStorage.getItem('selectedRide');
  }

  onSubmit() {
    let user = this.authenticationService.user$.value;
    this.riderService.emitRider(user);
    localStorage.setItem('selectedRide', this.model.ride);
    this.alertService.success(`You have been logged in to ride ${this.model.ride}`, true);

    return this.router.navigate([ '/riders-map2' ]);
  }

  logOutFromRide() {
    localStorage.removeItem('selectedRide');
    this.selectedRide = '';
    this.riderService.removeRider();
    this.alertService.success("You have been logged out from the ride.");
  }

}

