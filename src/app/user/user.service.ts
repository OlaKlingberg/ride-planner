import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import Socket = SocketIOClient.Socket;

import { environment } from "../../environments/environment";
import { PositionService } from '../core/position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from '../core/socket.service';
import { User } from "./user";

@Injectable()
export class UserService {
  user$: BehaviorSubject<User> = new BehaviorSubject(null);

  private headers: Headers;
  private requestOptions: RequestOptions;
  private socket: Socket;
  private token: string;

  constructor(private http: Http,
              private positionService: PositionService,
              private rideSubjectService: RideSubjectService,
              private socketService: SocketService) {
    this.joinRide();
    this.getRideFromStorage();
    this.getUserFromStorage();
    this.updateUserPositionOnNewPosition();
    this.updateUserPositionOnUserLogin();

    this.socket = this.socketService.socket;
  }


  create(user: User) {
    user.email = user.email.toLowerCase();

    return this.http.post(`${environment.api}/users`, user);
  }

  joinRide() {
    this.rideSubjectService.ride$.subscribe(ride => {
      if ( ride ) {
        this.userPositionPromise().then((user: User) => {
          let token = JSON.parse(environment.storage.getItem('rpToken'));
          console.log("About to emit joinRide");
          this.socket.emit('joinRide', user, ride, token, () => {
            user.ride = ride;
            this.user$.next(user);
            this.socket.emit('giveMeRiderList', ride);
          });
        })
      }
    });
  }

  getAllUsers() {
    this.token = JSON.parse(environment.storage.getItem('rpToken'));
    this.headers = new Headers({ 'x-auth': this.token });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions)
        .map(data => data.json().users)
        .toPromise();
  }

  getRideFromStorage() {
    let ride = environment.storage.getItem('rpRide');  // This may or may not exist.
    if ( ride ) this.rideSubjectService.ride$.next(ride);
  }

  getUserFromStorage() {
    // If I use the string, rather than the JSON-parsed object, in the conditional below, then a null string evaluates to true!
    // Todo: Figure out how on earth null can evaluate to true.
    let userObj = JSON.parse(environment.storage.getItem('rpUser'));

    if ( userObj && userObj.length > 0 ) {
      console.log("getUserFromStorage(). About to create new user with userString:", userObj);
      let user = new User(JSON.parse(userObj));
      environment.storage.removeItem('rpUser');
      setTimeout(() => {
        this.user$.next(user);
      }, 0);
    }
  }

  updateUserPositionOnNewPosition() {
    this.positionService.position$.subscribe(pos => {
      if ( pos ) {
        let user = this.user$.value;
        if ( user ) {
          user.position = JSON.parse(JSON.stringify(pos));
          this.user$.next(user);
          if ( user.ride ) this.socket.emit('updateUserPosition', user.position);
        }
      }
    });
  }

  updateUserPositionOnUserLogin() {
    let prevUser: User = null;

    this.user$.subscribe(user => {
      if ( prevUser === null && user ) {
        prevUser = user; // Todo: It doesn't matter here that this copies by reference, right?
        let pos = this.positionService.position$.value;
        if ( pos ) {
          user.position = JSON.parse(JSON.stringify(pos));
          this.user$.next(user);
          if ( user.ride ) this.socket.emit('updateUserPosition', user.position);
        }
      }

      if ( prevUser && user === null ) {
        prevUser = null;
      }
    });
  }

  // Todo: Will I be needing this?
  userPromise() {
    let userPromise = new Promise((resolve, reject) => {
      const subscription = this.user$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });

    return userPromise;
  }

  userPositionPromise() {
    let userPositionPromise = new Promise((resolve, reject) => {
      const subscription = this.user$.subscribe(user => {
        if (user && user.position && user.position.coords && user.position.coords.latitude) {
          resolve(user);
          subscription.unsubscribe();
        }
      })
    });

    return userPositionPromise;
  }

}
