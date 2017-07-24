import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Injectable()
export class AuthGuard implements CanActivate {
  user: User;
  private counter: number = 0;

  constructor(private router: Router,
              private userService: UserService) {
    // console.log("AuthGuard. constructor. Counter:", this.counter++);
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( this.user ) return true;

    // User not logged in, so redirect to login page.
    this.router.navigate([ './login' ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

