import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class RideLeaderGuard implements CanActivate {
  user: User;
  private counter: number = 0;

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
