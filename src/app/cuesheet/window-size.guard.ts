import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WindowSizeGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( window.innerWidth >= 800) {
      return true;
    } else {
      const url = `cuesheet/${next.url[0]}/bike-iframe/${next.url[2]}`;

      this.router.navigate([url]);

      return false;
    }


  }
}
