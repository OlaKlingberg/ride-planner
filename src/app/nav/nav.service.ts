import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RefreshService } from '../core/refresh.service';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class NavService {
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject('hide');

  constructor(private location: Location,
              private refreshService: RefreshService,
              private router: Router) {
    this.router.events.subscribe(event => {
          if ( event instanceof NavigationEnd ) this.setNavBarState();
        }
    );


  }

  setNavBarState() {
    console.log("NavService.set");
    if ( !this.location.path().includes('/iframe/') ) {
      if ( this.location.path().includes('/map') ) return this.navBarState$.next('hide');

      if ( this.location.path().includes('/cuesheet/') && this.location.path().includes('/bike/') ) return this.navBarState$.next('hide');
    }

    this.refreshService.autoRefreshPromise().then(autoRefresh => {
      autoRefresh ? this.navBarState$.next('hide') : this.navBarState$.next('show');
    });
  }

}
