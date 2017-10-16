import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import Socket = SocketIOClient.Socket;

import { environment } from "../../environments/environment";
import { User } from "../user/user";
import { UserService } from '../user/user.service';
import { SocketService } from '../core/socket.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AuthenticationService {
  private socket: Socket;

  constructor(private http: Http,
              private userService: UserService,
              private settingsService: SettingsService,
              private socketService: SocketService) {
    this.authenticateByToken(); // If there is an rpToken, log in the user automatically.
    this.socket = this.socketService.socket;
  }

  authenticateByToken() {
    // const token = JSON.parse(environment.storage.getItem('rpToken'));
    const token = JSON.parse(eval(this.settingsService.storage$.value).getItem('rpToken'));
    if ( token ) {
      const headers = new Headers({ 'x-auth': token });
      const requestOptions = new RequestOptions({ headers });

      this.http.get(`${environment.api}/users/authenticate-by-token`, requestOptions)
          .subscribe(response => {
            if ( response.status === 200 ) {
              let user: User = new User(response.json());
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
            // environment.storage.setItem('rpToken', JSON.stringify(token));
            eval(this.settingsService.storage$.value).setItem('rpToken', JSON.stringify(token));
            this.userService.user$.next(user);
          }
        });
  }

  logout() {
    // const token = JSON.parse(environment.storage.getItem('rpToken'));
    const token = JSON.parse(eval(this.settingsService.storage$.value).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    const requestOptions = new RequestOptions({ headers });

    return this.http.get(`${environment.api}/users/logout`, requestOptions);
  }


}


