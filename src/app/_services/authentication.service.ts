import { Injectable, EventEmitter, Output } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthenticationService {

  constructor(private http: Http,) {}

  login(email: string, password: string) {

    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let user = response.json();
          let token = response.headers.get('x-auth');

          if ( user && token ) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentToken', token);
          }
        })
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
  }
}