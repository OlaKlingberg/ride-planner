import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import Socket = SocketIOClient.Socket;

import { PositionService } from '../core/position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from '../core/socket.service';
import { User } from "./user";
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class UserService {
  // Todo: Does it make sense to provide both user and user$?
  // user: User;
  user$: BehaviorSubject<User> = new BehaviorSubject(null);
  userList$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  private socket: Socket;

  constructor(private http: Http,
              private positionService: PositionService,
              private rideSubjectService: RideSubjectService,
              private settingsService: SettingsService,
              private socketService: SocketService) {
    this.emitConnectedLoggedInUser();
    this.joinRide();
    this.getRideFromStorage();
    this.getUserFromStorage();
    // this.subscribeToUser();
    this.updateUserPositionOnNewPosition();
    this.updateUserPositionOnUserLogin();

    this.socket = this.socketService.socket;
  }

  addDummyMembers() {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/users/add-dummy-members`, requestOptions)
        .toPromise();
  }

  create(user: User) {
    user.email = user.email.toLowerCase();

    return this.http.post(`${this.settingsService.api}/users`, user);
  }

  deleteDummyMembers() {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/users/delete-dummy-members`, requestOptions)
        .toPromise();
  }

  emitConnectedLoggedInUser() {
    this.user$.subscribe(user => {
       this.socketService.socketPromise()
           .then(() => {
             if (user) {
               this.socket.emit('addConnectedLoggedInUser', user.email);
             } else {
               this.socket.emit('removeConnectedLoggedInUser')
             }
           });
    });
  }

  joinRide() {
    this.rideSubjectService.ride$.subscribe(ride => {
      if ( ride ) {
        this.userPositionPromise().then((user: User) => {
          const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
          this.socket.emit('joinRide', user, ride, token, () => {
            // console.log("user:", user);
            user.ride = ride;
            this.user$.next(user);
            console.log("About to emit giveMeRiderList!");
            this.socket.emit('giveMeRiderList', ride);
          });
        })
      }
    });
  }

  getRideFromStorage() {
    let ride = eval(this.settingsService.storage).getItem('rpRide');  // This may or may not exist.
    if ( ride ) this.rideSubjectService.ride$.next(ride);
  }

  getUserFromStorage() {
    let rpUser = JSON.parse(eval(this.settingsService.storage).getItem('rpUser'));

    if ( rpUser && rpUser.length > 0 ) {
      let user = new User(JSON.parse(rpUser));
      eval(this.settingsService.storage).removeItem('rpUser');
      setTimeout(() => {
        this.user$.next(user);
      }, 0);
    }
  }

  requestAllUsers() {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/users`, requestOptions)
        .map((response: Response) => this.userList$.next(response.json().users.map(user => new User(user))))
        .toPromise();
  }

  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

  // subscribeToUser() {
  //   this.user$.subscribe(user => {
  //     this.user = user;
  //   });
  // }

  updateUserPositionOnNewPosition() {
    this.positionService.position$.subscribe(pos => {
      if ( pos ) {
        let user = this.user$.value;
        if ( user ) {
          user.position = JSON.parse(JSON.stringify(pos));
          this.user$.next(user);
          // console.log("user.position:", user.position);
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
    return new Promise((resolve, reject) => {
      const subscription = this.user$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });
  }

  userPositionPromise() {
    return new Promise((resolve, reject) => {
      const subscription = this.user$.subscribe(user => {
        if (user && user.position && user.position.coords && user.position.coords.latitude) {
          resolve(user);
          subscription.unsubscribe();
        }
      })
    });
  }
}
