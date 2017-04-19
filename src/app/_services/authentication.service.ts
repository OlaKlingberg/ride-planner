import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import { BehaviorSubject } from "rxjs/Rx";

import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import Socket = SocketIOClient.Socket;

@Injectable()
export class AuthenticationService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(null);
  private currentToken;
  private headers;
  private requestOptions;

  constructor(private http: Http,) { }

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
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    this.http.get(`${environment.api}/users/authenticate-by-token`, this.requestOptions)
        .subscribe(response => {
          if (response.status === 200) {
            let user: User = new User(response.json());
            this.user$.next(user)
          }
        });
  }

  logout() {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    // I remove the user from localStorage and the observable before I even try to remove the token from the backend -- so the user will be removed from the front end, even if the api call to remove the token fails. Is that the behavior I want?
    localStorage.removeItem('currentToken');
    this.user$.next(null);

    return this.http.delete(`${environment.api}/users/logout`, this.requestOptions);
  }

}


