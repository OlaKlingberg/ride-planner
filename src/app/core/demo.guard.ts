import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class DemoGuard implements CanActivate {
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {

    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( !this.user.demo ) return true;

    // The user is using the demo account, so should be sent to components that don't persist anything.
    const url = `${state.url}/demo`;
    this.router.navigate([url]);

    return false;
  }
}
