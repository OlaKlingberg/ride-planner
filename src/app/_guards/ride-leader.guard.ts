import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

@Injectable()
export class RideLeaderGuard implements CanActivate {
  user: User;

  constructor(private router: Router,
              private userService: UserService) {

    this.userService.user$.subscribe(
        user => this.user = user
    );
  }
  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.user && this.user.leader === true) return true;

    // User not ride leader, so redirect to home page.
    this.router.navigate([ './' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
