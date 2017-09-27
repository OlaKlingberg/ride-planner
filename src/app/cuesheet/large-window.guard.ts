import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LargeWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // console.log("next:", next);
    // console.log("state:", state);

    if ( window.innerWidth >= 800) {
      console.log("LargeWindowGuard passed");
      return true;
    } else {
      let url = 'cuesheet/iframe';
      for (let i = 0; i < next.url.length; i++) {
        url += `/${next.url[i]}`;
      }
      console.log("LargeWindowGuard didn't pass. Rerouting to url:", url);

      this.router.navigate([url]);

      return false;
    }


  }
}
