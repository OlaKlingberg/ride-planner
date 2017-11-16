import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
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

    console.log("NotLoggedInGuard.canActivate()");

    if (!this.user) return true;

    this.router.navigate(['/']);
    return false;
  }
}
