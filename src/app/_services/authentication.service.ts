import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import 'rxjs/Rx';

import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import Socket = SocketIOClient.Socket;
import { MiscService } from './misc.service';
import { Rider } from '../_models/rider';
import { RiderService } from './rider.service';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
  private currentToken;
  private headers;
  private requestOptions;
  private socket: Socket;


  constructor(private http: Http,
              private miscService: MiscService,
              private userService: UserService,
              private riderService: RiderService) {
    this.authenticateByToken(); // If the user has a token, log them in automatically.
    this.socket = this.miscService.socket;
    this.addAdminsToRoomAdmins();

  }

  authenticateByToken() {
    const currentToken = environment.storage.getItem('currentToken');
    if ( currentToken ) {
      this.currentToken = environment.storage.getItem('currentToken');
      this.headers = new Headers({ 'x-auth': JSON.parse(this.currentToken) });
      this.requestOptions = new RequestOptions({ headers: this.headers });

      this.http.get(`${environment.api}/users/authenticate-by-token`, this.requestOptions)
          .subscribe(response => {
            if ( response.status === 200 ) {
              let user: User = new User(response.json());
              user.token = this.currentToken;
              console.log("authenticateByToken(). user:", user);
              this.userService.user$.next(user)
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
            console.log("About to set currentToken in storage.");
            environment.storage.setItem('currentToken', JSON.stringify(token));
            user.token = token;
            console.log("About to call user$.next(user)");
            this.userService.user$.next(user);
          }
        });
  }

  logout() {
    let user = this.userService.user$.value;
    let ride = this.riderService.currentRide$.value;
    let rider = new Rider(user, null, ride);

    this.currentToken = JSON.parse(environment.storage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    // Todo: I remove the user from environment.storage and the observable before I even try to remove the token from the backend -- so the user will be removed from the front end, even if the api call to remove the token fails. Is that the behavior I want? Probably not. If the backend fails, then the user will think incorrectly that he has been logged out.
    environment.storage.removeItem('currentToken');
    this.userService.user$.next(null);
    this.riderService.currentRide$.next(null);

    this.socket.emit('removeRider', rider, () => {
      // Todo: Do I have any use for this callback?
    });

    return this.http.delete(`${environment.api}/users/logout`, this.requestOptions);
  }

  addAdminsToRoomAdmins() {
    this.userService.user$.subscribe(user => {
      if ( user ) {
        if ( user.admin === true ) {
          let token = environment.storage.getItem('currentToken');
          // user.token = token;
          this.socket.emit('admin', JSON.parse(token), () => {
            // Todo: Do I have any use for this callback?
          });
        }
      }
    });
  }


}


