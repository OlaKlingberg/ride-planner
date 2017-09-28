import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SmallWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( window.innerWidth < 800 ) {
      return true;
    } else {
      let urlSegments: string[] = state.url.split('/').filter(segment => segment !== 'iframe');
      let url: string = urlSegments.join('/');

      this.router.navigate([ url ]);

      return false;
    }


  }
}
