import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Injectable } from "@angular/core";

import Socket = SocketIOClient.Socket;

import { User } from "../user/user";
import { UserService } from '../user/user.service';
import { SettingsService } from '../settings/settings.service';
import { SocketService } from '../core/socket.service';

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
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    if ( token ) {
      const headers = new Headers({ 'x-auth': token });
      const requestOptions = new RequestOptions({ headers });

      this.http.get(`${this.settingsService.api}/users/authenticate-by-token`, requestOptions)
          .subscribe(response => {
            if ( response.status === 200 ) {
              let user: User = new User(response.json());
              this.userService.user$.next(user);
            }
          });
    }
  }

  getUnusedDemoUsers() {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/users/demo-users`, requestOptions)
        .map((response: Response) => {
          return response.json();
        })
        .toPromise();
  }

  login(email: string, password: string) {
    return this.http.post(`${this.settingsService.api}/users/login`, { email, password })
        .map((response: Response) => {
          let token = response.headers.get('x-auth');
          let user: User = new User(response.json());

          if ( user && token ) {
            eval(this.settingsService.storage).setItem('rpToken', JSON.stringify(token));
            this.userService.user$.next(user);
            this.socket.emit('userLogin', user);
          }
        });
  }

  logout() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    const requestOptions = new RequestOptions({ headers });

    return this.http.get(`${this.settingsService.api}/users/logout`, requestOptions);
  }

  resetPassword(email: string, token: string, password: string) {
    return this.http.post(`${this.settingsService.api}/users/reset-password`, {email, token, password})
        .map((response: Response) => {
          return response.json().message;
        })
  }

  sendResetPasswordRequest(email: string) {
    const host = window.location.host;
    return this.http.post(`${this.settingsService.api}/users/reset-password-request`, { email, host })
        .map((response: Response) => {
          return response.json().message;
        });
  }

  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    
    return new RequestOptions({ headers });
  }
}


