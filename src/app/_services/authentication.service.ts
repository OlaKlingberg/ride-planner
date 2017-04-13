import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { BehaviorSubject } from "rxjs/Rx";

import { environment } from "../../environments/environment";
import { User } from "../_models/user";

@Injectable()
export class AuthenticationService {
  user$: BehaviorSubject<any>;

  constructor(private http: Http,) {
    this.user$ = new BehaviorSubject(null);
  }

  login(email: string, password: string) {

    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let user: User = new User(response.json()); // By creating a new User, I get access to accessor methods.
          let token = response.headers.get('x-auth');

          if ( user && token ) {
            localStorage.setItem('currentToken', JSON.stringify(token));
            this.user$.next(user);
          }
        });
  }

  authenticateByToken(currentToken) {
    const headers = new Headers({ 'x-auth': currentToken });
    const requestOptions = new RequestOptions({ headers });

    this.http.get(`${environment.api}/users/authenticate-by-token`, requestOptions)
        .subscribe(response => {
          let user: User = new User(response.json());
          if (response.status === 200) this.user$.next(user)
        });
  }


  logout() {
    const currentToken = JSON.parse(localStorage.getItem('currentToken'));
    const headers = new Headers({ 'x-auth': currentToken });
    const requestOptions = new RequestOptions({ headers });

    // I remove the user from localStorage and the observable before I even try to remove the token from the backend -- so the user will be removed from the front end, even if the api call to remove the token fails. Is that the behavior I want?
    localStorage.removeItem('currentToken');
    this.user$.next(null);

    return this.http.delete(`${environment.api}/users/logout`, requestOptions);
  }


}


