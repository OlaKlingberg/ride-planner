import { Injectable } from '@angular/core';

import { PositionService } from './position.service';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../settings/settings.service';
import Timer = NodeJS.Timer;


@Injectable()
export class RefreshService {
  private autoRefreshFlag: boolean = null;
  private intervalTimer: Timer;
  private subscription: Subscription;

  constructor(private positionService: PositionService,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
    this.autoRefresh();
    this.checkAutoRefresh();
  }

  autoRefresh() {
    this.intervalTimer = setInterval(() => {
      if (this.subscription) this.subscription.unsubscribe();

      this.subscription = this.router.events.subscribe(event => {
        this.refresh();
      });
    }, this.settingsService.refreshOnNavigationAfter * 60000);
  }

  // Returns a Promise that resolves to true if the app was auto-refreshed.
  autoRefreshPromise() {
    return new Promise((resolve, reject) => {
      resolve(this.autoRefreshFlag);
    });
  }

  checkAutoRefresh() {
    this.autoRefreshFlag = eval(this.settingsService.storage).getItem('rpAutoRefreshFlag') === 'true';
    eval(this.settingsService.storage).removeItem('rpAutoRefreshFlag');

    // If the user navigates away from map and navigates back, autoRefreshPromise should resolve false;
    setTimeout(() => {
      this.autoRefreshFlag = false;
    }, 1000);
  }

  refresh() {
    let position: Position = this.positionService.position$.value;
    let user: User = this.userService.user$.value;

    eval(this.settingsService.storage).setItem('rpAutoRefreshFlag', 'true');
    eval(this.settingsService.storage).setItem('rpPosition', JSON.stringify(position));
    eval(this.settingsService.storage).setItem('rpUser', JSON.stringify(user));

    window.location.reload();
  }


}



