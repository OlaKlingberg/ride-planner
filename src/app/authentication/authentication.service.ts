import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import Socket = SocketIOClient.Socket;

import { environment } from "../../environments/environment";
import { User } from "../user/user";
import { UserService } from '../user/user.service';
import { SocketService } from '../core/socket.service';

@Injectable()
export class AuthenticationService {
  private socket: Socket;

  constructor(private http: Http,
              private userService: UserService,
              private socketService: SocketService) {
    this.authenticateByToken(); // If the user has a token, log them in automatically.
    this.socket = this.socketService.socket;
  }

  authenticateByToken() {
    const token = JSON.parse(environment.storage.getItem('rpToken'));
    if ( token ) {
      const headers = new Headers({ 'x-auth': token });
      const requestOptions = new RequestOptions({ headers });

      this.http.get(`${environment.api}/users/authenticate-by-token`, requestOptions)
          .subscribe(response => {
            if ( response.status === 200 ) {
              let user: User = new User(response.json());
              // console.log("AuthenticationService.authenticateByToken(). user:", user);
              this.userService.user$.next(user);
            }
          });
    }
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let token = response.headers.get('x-auth');
          let user: User = new User(response.json());

          if ( user && token ) {
            environment.storage.setItem('rpToken', JSON.stringify(token));
            this.userService.user$.next(user);
          }
        });
  }

  logout() {
    const token = JSON.parse(environment.storage.getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    const requestOptions = new RequestOptions({ headers });

    return this.http.get(`${environment.api}/users/logout`, requestOptions);
  }


}


