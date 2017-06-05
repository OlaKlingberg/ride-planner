import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { User } from "../_models/user";
import { environment } from "../../environments/environment";
import Socket = SocketIOClient.Socket;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MiscService } from './misc.service';
import { Subscription } from 'rxjs/Subscription';
import { DebuggingService } from './debugging.service';

@Injectable()
export class UserService {
  token: string;
  headers: Headers;
  requestOptions: RequestOptions;
  geoWatchTimer: any;
  geoWatch: any;
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public position$: BehaviorSubject<any> = new BehaviorSubject(null);
  public ride$: BehaviorSubject<string> = new BehaviorSubject(null);
  // public ride: string;

  private userSub1: Subscription;
  // private userSub2: Subscription;
  private rideSub: Subscription;
  // private positionSub: Subscription;

  private socket: Socket;

  constructor(private http: Http,
              private miscService: MiscService,
              private debuggingService: DebuggingService) {
    this.getRideFromStorage();
    this.watchPosition();
    this.watchWhenToJoinRide();
    this.watchWhenToUpdateUserPosition();
    this.socket = this.miscService.socket;
  }

  getRideFromStorage() {
    console.log("UserService.getRideFromStorage()");
    let ride = environment.storage.getItem('rpRide');  // This may or may not exist.
    console.log("UserService.getRideFromStorage(). ride:", ride);
    if ( ride ) this.ride$.next(ride);
  }

  watchPosition() {
    this.geoWatch = navigator.geolocation.watchPosition(position => {
          console.log("position:", position);
          this.position$.next(position);
          let user = this.user$.value;
          if (!user || !user.fname) this.debuggingService.debugMessages$.next(`geolocation.watchPosition: success: Latitude: ${position.coords.latitude}.`);
          if (user && user.fname) this.debuggingService.debugMessages$.next(`${this.user$.value.fname} ${this.user$.value.lname}. geolocation.watchPosition: success: Latitude: ${position.coords.latitude}.`);
          // Set timer to up rerun watchPosition if it has not yielded results for a while. Logically, this should not be needed, but it often seems to yield a new position.
          clearTimeout(this.geoWatchTimer);
          this.startGeoWatchTimer(position);
        },
        err => {
          console.log(`watchPosition error: ${err.message}`);
          this.debuggingService.debugMessages$.next(`${this.user$.value.fname} ${this.user$.value.lname}. geolocation.watchPosition: err: ${err}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,      // Todo: Figure out what value I want here, and what to do on timeout.
          maximumAge: 5000
        }
    );
  }

  startGeoWatchTimer(position) {
    this.geoWatchTimer = setTimeout(() => {
      if ( Date.now() - position.timestamp > 19000 ) {
        navigator.geolocation.clearWatch(this.geoWatch);
        this.watchPosition();
        // this.startGeoWatchTimer(position); // Todo: Is this needed? Why did I have this before?
      }
    }, 20000);
  }

  watchWhenToJoinRide() {
    // Wait till we have a user.position ...
    let userPositionPromise = new Promise((resolve, reject) => {
      this.userSub1 = this.user$.subscribe(user => {
        if ( user && user.position ) resolve(user)
      });
    });

    // ... and a ride selection ...
    let ridePromise = new Promise((resolve, reject) => {
      this.rideSub = this.ride$.subscribe(ride => {
        if ( ride ) resolve(ride);
      })
    });

    // .. and then emit joinRide.
    Promise.all([ userPositionPromise, ridePromise ])
        .then(userAndRide => {
          this.userSub1.unsubscribe();
          this.rideSub.unsubscribe();
          let user: any = userAndRide[ 0 ];
          let ride = userAndRide[ 1 ];

          console.log("socket.emit('joinRide'):", user, ride);
          this.socket.emit('joinRide', user, ride, () => {
            user.ride = ride;
            this.user$.next(user);
          });
        });
  }

  watchWhenToUpdateUserPosition() {
    this.user$
        .combineLatest(this.position$)
        .subscribe(([ user, position ]) => {
          if ( user && position ) {
            // Update user.position, but only if the position has changed enough.
            if (
                !user.position ||
                Math.abs(user.position.coords.latitude - position.coords.latitude) > .0001 ||
                Math.abs(user.position.coords.longitude - position.coords.longitude) > .0001 ||
                user.position.coords.accuracy > position.coords.accuracy
            ) {
              user.position = {
                coords: {
                  accuracy: position.coords.accuracy,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                },
                timestamp: position.timestamp
              };
              // And emit updateUserPosition, but only if the user has joined a ride.
              this.user$.next(user);
              if ( user.ride ) console.log("socket.emit('updateUserPosition'):", user.position);
              if ( user.ride ) this.socket.emit('updateUserPosition()', user.position);
            }
          }
        });
  }

  create(user: User) {
    user.email = user.email.toLowerCase();

    return this.http.post(`${environment.api}/users`, user);
  }

  getAllUsers() {
    this.token = JSON.parse(environment.storage.getItem('rpToken'));
    this.headers = new Headers({ 'x-auth': this.token });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions);
  }


}