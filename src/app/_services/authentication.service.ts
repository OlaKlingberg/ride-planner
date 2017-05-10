import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import 'rxjs/Rx';

import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import Socket = SocketIOClient.Socket;
import { StatusService } from './status.service';
import { Rider } from '../_models/rider';

@Injectable()
export class AuthenticationService {
  private currentToken;
  private headers;
  private requestOptions;
  private socket: Socket;


  constructor(private http: Http,
              private statusService: StatusService) {
    this.authenticateByToken(); // If the user has a token, log them in automatically.
    this.socket = this.statusService.socket;
    this.addAdminsToRoomAdmins();

  }

  authenticateByToken() {
    const currentToken = localStorage.getItem('currentToken');
    if ( currentToken ) {
      this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
      this.headers = new Headers({ 'x-auth': this.currentToken });
      this.requestOptions = new RequestOptions({ headers: this.headers });

      this.http.get(`${environment.api}/users/authenticate-by-token`, this.requestOptions)
          .subscribe(response => {
            if ( response.status === 200 ) {
              let user: User = new User(response.json());
              this.statusService.user$.next(user)
            }
          });
    }
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.api}/users/login`, { email, password })
        .map((response: Response) => {
          let user: User = new User(response.json()); // By creating a new User, I get access to accessor methods.
          let token = response.headers.get('x-auth');

          if ( user && token ) {
            localStorage.setItem('currentToken', JSON.stringify(token));
            this.statusService.user$.next(user);
          }
        });
  }

  logout() {
    let user = this.statusService.user$.value;
    let ride = this.statusService.currentRide$.value;
    let rider = new Rider(user, null, ride);

    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    // Todo: I remove the user from localStorage and the observable before I even try to remove the token from the backend -- so the user will be removed from the front end, even if the api call to remove the token fails. Is that the behavior I want? Probably not. If the backend fails, then the user will think incorrectly that he has been logged out.
    localStorage.removeItem('currentToken');
    this.statusService.user$.next(null);
    this.statusService.currentRide$.next(null);

    this.socket.emit('removeRider', rider, () => {
      // Todo: Do I have any use for this callback?
    });

    return this.http.delete(`${environment.api}/users/logout`, this.requestOptions);
  }

  addAdminsToRoomAdmins() {
    this.statusService.user$.subscribe(user => {
      if ( user ) {
        if ( user.admin === true ) {
          let token = localStorage.getItem('currentToken');
          // user.token = token;
          this.socket.emit('admin', JSON.parse(token), () => {
            // Todo: Do I have any use for this callback?
          });
        }
      }
    });
  }



}


