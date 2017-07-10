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
  private token: string;
  private headers: Headers;
  private requestOptions: RequestOptions;
  private geoWatchTimer: any;
  private geoWatch: any;
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public position$: BehaviorSubject<any> = new BehaviorSubject(null);
  public ride$: BehaviorSubject<string> = new BehaviorSubject(null);

  private userSub: Subscription;
  private userSub2: Subscription;
  private rideSub: Subscription;
  private positionSub: Subscription;

  private dummyLatInitialAdd: number = Math.random() * .001 - .0005;
  private dummyLngInitialAdd: number = Math.random() * .001 - .0005;
  private dummyUpdateFrequency: number = Math.random() * 2000 + 1000;
  // private dummyUpdateFrequency: number = 200;
  private dummyLatIncrement: number = Math.random() * .0002 - .0001;
  private dummyLngIncrement: number = Math.random() * .0002 - .0001;
  private dummyLatCurrentAdd: number = null;
  private dummyLngCurrentAdd: number = null;
  private updateTimer: any;

  private socket: Socket;

  constructor(private http: Http,
              private miscService: MiscService,
              private debuggingService: DebuggingService) {
    this.getRideFromStorage();
    // if (environment.dummyMovement) this.incrementDummyPositionAdds()
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

  // Todo: Refactor!
  watchPosition() {
    this.geoWatch = navigator.geolocation.watchPosition(position => {
          // console.log("position:", position);
          if (this.updateTimer) clearInterval(this.updateTimer);

          let pos = this.copyPositionObject(position);

          if (environment.dummyPosition) {
            pos.coords.latitude += this.dummyLatInitialAdd;
            pos.coords.longitude += this.dummyLngInitialAdd;
          }

          if (environment.dummyMovement) {
            let startLat = pos.coords.latitude;
            let startLng = pos.coords.longitude;
            this.updateTimer = setInterval(() => {
              this.dummyLatCurrentAdd += this.dummyLatIncrement;
              this.dummyLngCurrentAdd += this.dummyLngIncrement;
              pos.coords.latitude = startLat + this.dummyLatCurrentAdd;
              pos.coords.longitude = startLng + this.dummyLngCurrentAdd;
              this.position$.next(pos);
            }, this.dummyUpdateFrequency);
          } else {
            this.position$.next(pos);
          }

          // Set timer to rerun watchPosition if it has not yielded results for a while. Logically, this should not be needed, but it often seems to yield a new position.
          if (this.geoWatchTimer) clearTimeout(this.geoWatchTimer);
          this.startGeoWatchTimer(position);
        },
        err => {
          console.log(`watchPosition error: ${err.message}`);
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
        navigator.geolocation.clearWatch(this.geoWatch);
        this.watchPosition();
        this.startGeoWatchTimer(position);
    }, 20000);
  }

  copyPositionObject(position) {
    return {
      coords: {
        accuracy: position.coords.accuracy,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      timestamp: position.timestamp
    };
  }

  watchWhenToUpdateUserPosition() {
    if (this.positionSub) this.positionSub.unsubscribe();

    // Wait till we have a user ...
    let userPromise = new Promise((resolve, reject) => {
      this.userSub2 = this.user$.subscribe(user => {
        if ( user ) {
          resolve(user)
        }
      });
    });

    // ... and then subscribe to position$
    userPromise.then((user: any) => {
      // console.log("UserService.watchWhenToUpdateUserPosition. Promise resolved.");
      this.userSub2.unsubscribe();
      this.positionSub = this.position$.subscribe(position => {
        if (position) {
          user.position = {
            coords: {
              accuracy: position.coords.accuracy,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            timestamp: position.timestamp
          };
          this.user$.next(user);
          if ( user.ride ) this.socket.emit('updateUserPosition', user.position);
        }
      });
    });
  }

  watchWhenToJoinRide() {
    // Wait till we have a user.position ...
    let userPositionPromise = new Promise((resolve, reject) => {
      this.userSub = this.user$.subscribe(user => {
        if ( user && user.position.coords.latitude ) resolve(user)
      });
    });

    // ... and a ride selection ...
    let ridePromise = new Promise((resolve, reject) => {
      this.rideSub = this.ride$.subscribe(ride => {
        if ( ride ) resolve(ride);
      });
    });

    // .. and then emit joinRide.
    Promise.all([ userPositionPromise, ridePromise ])
        .then(userAndRide => {
          this.userSub.unsubscribe();
          this.rideSub.unsubscribe();
          let user: any = userAndRide[ 0 ];
          let ride = userAndRide[ 1 ];
          let token = JSON.parse(environment.storage.getItem('rpToken'));

          // console.log("socket.emit('joinRide'):", user, ride, new Date().toString());
          this.socket.emit('joinRide', user, ride, token, () => {
            user.ride = ride;
            this.user$.next(user);
          });
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
