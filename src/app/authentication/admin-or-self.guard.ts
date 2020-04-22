import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
  private memberId: string;
  private user: User;

  constructor(private router: Router,
              private userService: UserService) {
    console.log("AdminOrSelfGuard constructor");
    this.userService.user$.subscribe(user => {
        this.user = user;
      }
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let isUserLookingAtTheirOwnProfile = this.user._id === next.params.id;
    let isUserAdmin = this.user.admin;
    let isUserSuperAdmin = this.user.email === environment.superAdmin;

    if (this.user && (isUserSuperAdmin || isUserAdmin || isUserLookingAtTheirOwnProfile)) {
      return true;
    }

    // User is not admin or trying to access their own profile, so redirect to home page.
    this.router.navigate(['./'], { queryParams: { returnUrl: state.url } });

    return false;
  }
}
