import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class RideLeaderGuard implements CanActivate {
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }
  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.user && (this.user.email === environment.superAdmin || this.user.leader || this.user.admin ) ) return true;

    // User not ride leader, so redirect to home page.
    this.router.navigate([ '/' ]);
    return false;
  }
}
