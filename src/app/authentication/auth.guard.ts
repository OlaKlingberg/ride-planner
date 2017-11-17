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

    console.log("AuthGuard");
    if ( this.user ) return true;
    console.log(`AuthGuard failed! The user is not logged in. Will redirect to /auth/login?${state.url}`);

    // User not logged in, so redirect to login page.
    this.router.navigate([ './auth/login' ], { queryParams: { returnUrl: state.url } });
    return false;

  }
}

