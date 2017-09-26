import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user/user.service';
import { User } from '../user/user';

@Injectable()
export class JaneDoeGuard implements CanActivate {
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

    if (this.user.email !== 'jane.doe@example.com') return true;

    // The user is using the demo account, so should be sent to components that don't persist anything.
    // console.log("state:", state);
    // console.log("next:", next);
    const url = `${state.url}/demo`;
    this.router.navigate([url]);

    return false;
  }
}
