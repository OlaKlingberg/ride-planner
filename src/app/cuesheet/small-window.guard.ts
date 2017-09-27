import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SmallWindowGuard implements CanActivate {
  constructor(private router: Router) {

  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( window.innerWidth < 800) {
      console.log("SmallWindowGuard passed.");
      return true;
    } else {
      // const url = `cuesheet/${next.url[0]}/bike/${next.url[2]}`;

      let url = 'cuesheet';
      for (let i = 1; i < next.url.length; i++) {
        url += `/${next.url[i]}`;
      }
      console.log("SmallWindowGuard didn't pass. Rerouting to url:", url);

      this.router.navigate([url]);

      return false;
    }


  }
}
