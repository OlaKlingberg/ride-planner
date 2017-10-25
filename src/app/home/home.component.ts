import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../settings/settings.service';

import { environment, api, demoMode } from '../../environments/environment';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
 api: string;
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
    this.api = api;
    this.demoMode = this.settingsService.demoMode;

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // Todo: This looks complicated and messy. Can it be refactored?
    this.subscription = this.userService.user$.subscribe(user => {
      if ((this.returnUrl === '/riders' || this.returnUrl === '/members') && (user && user.leader === true)) {
        this.router.navigate([ this.returnUrl ]);
      }
      if (this.returnUrl === '/debugger' && (user && user.admin === true)) {

        this.router.navigate([ this.returnUrl ]);
      }

    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}