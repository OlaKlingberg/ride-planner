import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../_services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {
  loggedIn: boolean = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
    this.authenticationService.loggedIn$.subscribe(
        loggedIn => this.loggedIn = loggedIn
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( this.loggedIn ) return true;

    // User not logged in, so redirect to login page.
    this.router.navigate([ './login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
