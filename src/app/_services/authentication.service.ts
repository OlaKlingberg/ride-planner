import { Injectable, EventEmitter, Output } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import * as Rx from "rxjs/Rx";

import { environment } from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  loggedIn$ = new Rx.BehaviorSubject(null);

  constructor(private http: Http,) {
  }

  login(email: string, password: string) {

    console.log(email, password);

    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let user = response.json();
          let token = response.headers.get('x-auth');

          if ( user && token ) {
            user.token = token;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            this.loggedIn$.next({
              loggedInUser: user
            });
          }
        });
  }

  authenticateByToken(loggedInUser) {
    const headers = new Headers({ 'x-auth': loggedInUser.token });
    const requestOptions = new RequestOptions({ headers });

    this.http.get(`${environment.api}/users/authenticate-by-token`, requestOptions)
        .subscribe(response => {
          if (response.status === 200) this.loggedIn$.next({ loggedInUser })
        });
  }


  logout() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const headers = new Headers({ 'x-auth': loggedInUser.token });
    const requestOptions = new RequestOptions({ headers });

    // I remove the user from localStorage and the observable before I even try to remove the token from the backend -- so the user will be removed from the front end, even if the api call to remove the token fails. Is that the behavior I want?
    localStorage.removeItem('loggedInUser');
    this.loggedIn$.next(null);

    return this.http.delete(`${environment.api}/users/logout`, requestOptions);
  }


}


