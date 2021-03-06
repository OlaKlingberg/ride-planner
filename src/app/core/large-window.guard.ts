import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { getBootstrapDeviceSize } from '../_lib/util';

@Injectable()
export class LargeWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const size = getBootstrapDeviceSize();

    if ( size !== 'xs' && size !== 'sm' ) {
      return true;
    } else {
      let urlSegments: string[] = state.url.split('/').filter(segment => segment !== 'frame');
      let url: string = urlSegments.join('/');

      this.router.navigate([ url ]);

      return false;
    }
  }
}
