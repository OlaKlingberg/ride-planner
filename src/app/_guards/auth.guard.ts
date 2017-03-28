import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../_services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {
  loggedInUser: Object = {};

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.authenticationService.loggedIn$.subscribe(
        user => this.loggedInUser = user
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( this.loggedInUser ) return true;

    // User not logged in, so redirect to login page.
    this.router.navigate([ './login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
