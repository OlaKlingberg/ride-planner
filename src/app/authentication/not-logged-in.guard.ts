import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  private returnUrl: string;
  private user: User;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(user => this.user = user);

    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log("NotLoggedInGuard");
    if ( !this.user ) return true;
    console.log("NotLoggedInGuard failed! The user is already logged in. Will redirect to", this.returnUrl);

    this.router.navigate([ this.returnUrl ]);
    return false;
  }
}
