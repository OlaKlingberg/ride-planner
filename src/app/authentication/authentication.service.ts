import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import Socket = SocketIOClient.Socket;

import { environment } from "../../environments/environment";
import { User } from "../user/user";
import { UserService } from '../user/user.service';
import { SocketService } from '../core/socket.service';
import { SettingsService } from '../settings/settings.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
  connectedLoggedInUsers$: BehaviorSubject<any> = new BehaviorSubject(null);

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
          }
        });
  }

  logout() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    const requestOptions = new RequestOptions({ headers });

    return this.http.get(`${this.settingsService.api}/users/logout`, requestOptions);
  }

  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

}


