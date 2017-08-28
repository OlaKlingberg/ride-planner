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
    this.emitJoinRideOnNewRide();
    this.getRideFromStorage();
    this.updateUserPositionOnNewPosition();
    this.updateUserPositionOnNewUser();

    this.socket = this.socketService.socket;
  }


  create(user: User) {
    user.email = user.email.toLowerCase();

    return this.http.post(`${environment.api}/users`, user);
  }

  // Emit 'joinRide' when ride$ yields a new non-null value, provided there is a user with a user.position.
  emitJoinRideOnNewRide() {
    this.rideSubjectService.ride$.subscribe(ride => {
      let user = this.user$.value;
      let token = JSON.parse(environment.storage.getItem('rpToken'));

      if ( ride && user && user.position && token ) {
        this.socket.emit('joinRide', user, ride, token, () => {
          user.ride = ride;
          this.user$.next(user);
        });
      }
    });
  }

  getAllUsers() {
    this.token = JSON.parse(environment.storage.getItem('rpToken'));
    this.headers = new Headers({ 'x-auth': this.token });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions);
  }

  getRideFromStorage() {
    let ride = environment.storage.getItem('rpRide');  // This may or may not exist.
    if ( ride ) this.rideSubjectService.ride$.next(ride);
  }

  // Call user$.next, whenever there is a new position, provided there is a user.
  updateUserPositionOnNewPosition() {
    this.positionService.position$.subscribe(pos => {
      let user = this.user$.value;
      if ( user ) {
        user.position = JSON.parse(JSON.stringify(pos));
        this.user$.next(user);
      }
    });
  }

  // Call user$.next() whenever user$ changes from null to a user, provided there is a position.
  updateUserPositionOnNewUser() {
    let prevUser: User = null;

    this.user$.subscribe(user => {
      if ( prevUser === null && user !== null ) {
        prevUser = user; // Todo: It doesn't matter here that this copies by reference, right?
        let pos = this.positionService.position$.value;
        if ( pos ) {
          user.position = JSON.parse(JSON.stringify(pos));
          this.user$.next(user);
        }
      }

      if ( prevUser !== null && user === null ) {
        prevUser = null;
      }
    });
  }
}
