import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { CuesheetService } from './cuesheet.service';

@Injectable()
export class CuesheetEditGuard implements CanActivate {
  private user: User;

  constructor(private cuesheetService: CuesheetService,
              private router: Router,
              private userService: UserService) {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("next.url[0].path", next.url[ 0 ].path);

    let cuesheetId = next.url[ 0 ].path;

    return this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          let userIsCreator = cuesheet._creator._id === this.user._id;

          if ( this.user && (this.user.email === environment.superAdmin || this.user.leader || this.user.admin || userIsCreator) ) return true;

          // User not ride leader, so redirect to home page.
          this.router.navigate([ '/' ]);
          return false;
        });
  }
}