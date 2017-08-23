import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';
import { User } from '../user/user';

@Injectable()
export class AuthGuard implements CanActivate {
  user: User;

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

