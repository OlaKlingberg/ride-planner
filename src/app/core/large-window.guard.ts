import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LargeWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( window.innerWidth >= 800 ) { // Todo: Should I set this to a bootstrap size?
      return true;
    } else {
      let urlSegments: string[] = state.url.split('/').filter(segment => segment !== 'frame');
      let url: string = urlSegments.join('/');

      this.router.navigate([ url ]);

      return false;
    }
  }
}
