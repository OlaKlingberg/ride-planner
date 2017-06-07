import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import 'rxjs/Rx';

import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import Socket = SocketIOClient.Socket;
import { MiscService } from './misc.service';
import { RiderService } from './rider.service';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
  private socket: Socket;


  constructor(private http: Http,
              private miscService: MiscService,
              private userService: UserService,
              private riderService: RiderService) {
    this.authenticateByToken(); // If the user has a token, log them in automatically.
    this.socket = this.miscService.socket;
    // this.addAdminsToRoomAdmins();
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
              console.log("AuthenticationService.authenticateByToken(). user:", user);
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

            // Todo: This seems like a lot of code. Is there a simpler way?
            // let position = this.userService.position$.value;
            // if (position) {
            //   user.position = {
            //     coords: {
            //       accuracy: position.coords.accuracy,
            //       latitude: position.coords.accuracy,
            //       longitude: position.coords.longitude
            //     },
            //     timestamp: position.timestamp
            //   };
            // }
            console.log("AuthenticationService.login(). About to call userService.user$.next(user)");
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


