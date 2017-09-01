import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
import { PositionService } from './position.service';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class RefreshService {
  private autoRefreshFlag: boolean = null;
  private intervalTimer;
  private subscription: Subscription;

  constructor(private positionService: PositionService,
              private router: Router,
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
    }, environment.refreshOnNavigation);
  }

  // Returns a Promise that resolves to true if the app was auto-refreshed.
  autoRefreshPromise() {
    return new Promise((resolve, reject) => {
      resolve(this.autoRefreshFlag);
    });
  }

  checkAutoRefresh() {
    this.autoRefreshFlag = environment.storage.getItem('rpAutoRefreshFlag') === 'true';
    environment.storage.removeItem('rpAutoRefreshFlag');

    // If the user navigates away from map and navigates back, autoRefreshPromise should resolve false;
    setTimeout(() => {
      this.autoRefreshFlag = false;
    }, 1000);
  }

  refresh() {
    let position: Position = this.positionService.position$.value;
    let user: User = this.userService.user$.value;

    environment.storage.setItem('rpAutoRefreshFlag', 'true');
    environment.storage.setItem('rpPosition', JSON.stringify(position));
    environment.storage.setItem('rpUser', JSON.stringify(user));

    window.location.reload();
  }


}



