import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {

    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.user && this.user.admin ) return true;

    // User is not admin, so redirect to home page.
    this.router.navigate(['./'], { queryParams: { returnUrl: state.url } });

    return false;
  }
}
