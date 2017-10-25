import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Ride } from '../ride';
import { RideService } from '../ride.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

import { environment } from '../../../environments/environment';
import { SettingsService } from '../../settings/settings.service';

@Component({
  templateUrl: './ride-creator.component.html',
  styleUrls: [ './ride-creator.component.scss' ]
})
export class RideCreatorComponent implements OnInit, OnDestroy {
  demoMode: boolean;
  loading: boolean = false;
  model: any = {};
  ride: Ride;
  user: User;

  private subscription: Subscription;

  constructor(private alertService: AlertService,
              private rideService: RideService,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
    this.demoMode = this.settingsService.demoMode;
  }

  ngOnInit() {
    this.userService.userPromise().then(user => {
      this.user = new User(user);

      console.log("demoMode:", this.demoMode);
      console.log("user.demo:", this.user.demo);
    });
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
