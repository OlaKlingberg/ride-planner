import { Injectable, EventEmitter, Output } from "@angular/core";
import { Http, Response } from "@angular/http";

import * as Rx from "rxjs/Rx";

import { environment } from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  loggedIn$ = new Rx.BehaviorSubject( null );

  constructor(private http: Http,) {
  }

  login(email: string, password: string) {

    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let user = response.json();
          let token = response.headers.get('x-auth');

          if ( user && token ) {
            user.token = token;
            this.loggedIn$.next( {
              currentUser: user
            });
          }
        })
  }

  logout() {
    this.loggedIn$.next( null );
  }


}


