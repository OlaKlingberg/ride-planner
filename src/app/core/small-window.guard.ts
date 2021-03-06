import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { getBootstrapDeviceSize } from '../_lib/util';

@Injectable()
export class SmallWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const size = getBootstrapDeviceSize();

    if ( size === 'xs' || size === 'sm' ) {
      return true;
    } else {
      let urlSegments: string[] = state.url.split('/');
      urlSegments.splice(2, 0, 'frame');

      let url = urlSegments.join('/');

      this.router.navigate([ url ]);

      return false;
    }
  }
}
