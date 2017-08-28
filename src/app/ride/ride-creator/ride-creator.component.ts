import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Ride } from '../ride';
import { RideService } from '../ride.service';

@Component({
  templateUrl: './ride-creator.component.html',
  styleUrls: [ './ride-creator.component.scss' ]
})
export class RideCreatorComponent {
  loading: boolean = false;
  model: any = {};
  ride: Ride;

  private rideSub: Subscription;

  constructor(private alertService: AlertService,
              private rideService: RideService,
              private router: Router) {
  }

  createRide() {
    this.loading = true;
    this.rideSub = this.rideService.createRide(this.model)
        .subscribe((ride: Ride) => {
              this.alertService.success(`The ride "${ride.name}" has been created`, true);
              this.router.navigate([ '/ride/select' ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            }
        )
  }

}
