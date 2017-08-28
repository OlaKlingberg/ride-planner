import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( this.user ) return true;

    // User not logged in, so redirect to login page.
    this.router.navigate([ './auth/login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

