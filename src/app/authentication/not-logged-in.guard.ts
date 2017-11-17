import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  // private returnUrl: string;
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(user => this.user = user);
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log("NotLoggedInGuard");
    console.log("state:", state);
    let returnUrl = state.url.split('?returnUrl=')[1];
    returnUrl = returnUrl ? decodeURIComponent(returnUrl) : '/';
    console.log("returnUrl:", returnUrl);

    if ( !this.user ) return true;
    console.log("NotLoggedInGuard failed! The user is already logged in. Will redirect to", returnUrl);

    this.router.navigate([ returnUrl ]);
    return false;
  }
}
