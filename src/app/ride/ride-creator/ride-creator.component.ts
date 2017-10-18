import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Ride } from '../ride';
import { RideService } from '../ride.service';

@Component({
  templateUrl: './ride-creator.component.html',
  styleUrls: [ './ride-creator.component.scss' ]
})
export class RideCreatorComponent implements OnDestroy {
  loading: boolean = false;
  model: any = {};
  ride: Ride;

  private subscription: Subscription;

  constructor(private alertService: AlertService,
              private rideService: RideService,
              private router: Router) {
  }

  createRide() {
    this.loading = true;
    this.subscription = this.rideService.createRide(this.model)
        .subscribe((ride: Ride) => {
              this.alertService.success(`The ride "${ride.name}" has been created`, true, true);
              this.router.navigate([ '/ride/select' ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            }
        )
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
