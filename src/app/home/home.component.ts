import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../settings/settings.service';

import { getBootstrapDeviceSize } from '../_lib/util';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
  deviceSize: string;
  demoMode: boolean;
  returnUrl: string;
  user: User;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // Todo: This looks complicated and messy. Can it be refactored?
    this.subscription = this.userService.user$.subscribe(user => {
      if ( (this.returnUrl === '/riders' || this.returnUrl === '/members') && (user && user.leader === true) ) {
        this.router.navigate([ this.returnUrl ]);
      }
      if ( this.returnUrl === '/debugger' && (user && user.admin === true) ) {

        this.router.navigate([ this.returnUrl ]);
      }
    });

    this.setDeviceSize();
    window.addEventListener('resize', this.setDeviceSize);
  }

  // I can't use an arrow function here, because I need to bind "this."
  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
  }.bind(this);

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('resize', this.setDeviceSize);

  }
}