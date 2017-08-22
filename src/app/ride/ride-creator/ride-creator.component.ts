import { Component, OnInit } from '@angular/core';
import { RideService } from '../ride.service';
import { AlertService } from '../../alert/alert.service';
import { Router } from '@angular/router';
import { Ride } from '../ride';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './ride-creator.component.html',
  styleUrls: ['./ride-creator.component.scss']
})
export class RideCreatorComponent implements OnInit {
  model: any = {};
  public loading: boolean = false;
  public ride: Ride;
  private rideSub: Subscription;

  constructor(private rideService: RideService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit() {
  }

  createRide() {
    this.loading = true;
    this.rideSub = this.rideService.createRide(this.model)
        .subscribe((ride: Ride) => {
              this.alertService.success(`The ride "${ride.name}" has been created`, true);
              this.router.navigate([ '/ride-selector' ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            }
        )
  }

}
