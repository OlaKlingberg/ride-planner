import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthenticationService {
  constructor(private http: Http,) {
  }

  login(email: string, password: string) {

    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          console.log(response.headers.get('x-auth'));
          let user = response.json();
          if ( user ) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('currentUser', user);
          }
        })
  }

  logout() {

  }
}