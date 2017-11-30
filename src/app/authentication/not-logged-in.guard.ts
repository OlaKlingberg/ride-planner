import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(user => this.user = user);
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let returnUrl = state.url.split('?returnUrl=')[1];
    returnUrl = returnUrl ? decodeURIComponent(returnUrl) : '/';

    if ( !this.user ) return true;

    this.router.navigate([ returnUrl ]);

    return false;
  }
}
