import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Rider } from '../_models/rider';
import { MiscService } from './misc.service';

import Socket = SocketIOClient.Socket;
import { AlertService } from './alert.service';

import * as _ from 'lodash';

import { nameSort } from '../_lib/util';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './user.service';
import { DebuggingService } from './debugging.service';

@Injectable()
export class RiderService {
  private socket: Socket;
  private LatDummyAddition: number;
  private LngDummyAddition: number;
  private userName: string = '';
  private prevPos: { lat: number, lng: number, acc: number } = { lat: null, lng: null, acc: null };
  private timer = null;
  private geoWatch = null;

  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  public userRider$: BehaviorSubject<Rider> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Array<Rider>> = new BehaviorSubject([]);
  public newRider$: Subject<Rider> = new Subject();
  public updatedRider$: Subject<Rider> = new Subject();
  public removedRider$: Subject<Rider> = new Subject();
  public disconnectedRider$: Subject<Rider> = new Subject();


  constructor(private miscService: MiscService,
              private alertService: AlertService,
              private userService: UserService,
              private debuggingService: DebuggingService) {
    this.socket = this.miscService.socket;
    this.listenForAvailableRides();
    this.keepRideInStorageSynced();
    this.joinOrLeaveRide();
    this.subscribeToUser();
    this.subscribeToCoords();
    this.emitRemoveRider();
    this.listenForFullRiderList();
    this.listenForNewRider();
    this.listenForUpdateRiderPosition();
    this.listenForRemoveRider();
    this.listenForDisconnectedRider();
    this.setDummyCoordAdjustments();

    // Set userRider, based on user, currentRide, and coords.
    this.userService.user$
        .combineLatest(this.currentRide$, this.coords$)
        .subscribe(([ user, ride, coords ]) => {
          if ( user && ride && coords ) {
            let userRider = new Rider(user, coords, ride);
            this.userRider$.next(userRider);
          } else {
            this.userRider$.next(null);
          }
        });
  }

  listenForAvailableRides() {
    this.socket.on('availableRides', (rides) => {
      this.availableRides$.next(rides);
    });
  }

  keepRideInStorageSynced() {
    let ride = environment.storage.getItem('currentRide');
    this.currentRide$.next(ride);

    this.currentRide$.subscribe(ride => {
      if ( ride ) {
        environment.storage.setItem('currentRide', ride);
      } else {
        environment.storage.removeItem('currentRide');
      }
    });
  }

  joinOrLeaveRide() {
    this.currentRide$
    // .delay(100) // Todo: Not sure if this works. Kind of ugly, in any case.
        .withLatestFrom(this.userRider$)
        .subscribe(([ ride, userRider ]) => {
          console.log("ride:", ride);
          console.log("userRider:", userRider);
          if ( ride && userRider ) {
            this.joinRide(userRider);
          } else {
            this.leaveRide(userRider);
          }
        });
  }

  joinRide(userRider) {
    this.socket.emit('joinRide', userRider, () => {
      console.log("joinRide() userRider:", userRider);
      this.socket.emit('giveMeFullRiderList', userRider);
      this.emitUpdatedRider();

    });
  }

  leaveRide(userRider) {
    this.socket.emit('leaveRide', userRider);
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
    });
  }

  subscribeToCoords() {
    if ( environment.dummyMovement ) this.setDummyMovements();

    // this.debugMessages$.next(`${this.userName}. watchPosition()`);

    this.geoWatch = navigator.geolocation.watchPosition(position => {
          // console.log(position.coords.latitude, position.coords.longitude, new Date(position.timestamp).toLocaleTimeString('en-US', { hour12: false }));
          // this.debugMessages$.next(`${this.userName}. New coords yielded! ${new Date().toLocaleTimeString('en-US', { hour12: false })}`);

          clearTimeout(this.timer);
          this.timerForSubscribeToCoords();

          if (  // Update the rider only if the coords have changed enough or the accuracy improved.
          Math.abs(position.coords.latitude - this.prevPos.lat) > .0001 ||
          Math.abs(position.coords.longitude - this.prevPos.lng) > .0001 ||
          position.coords.accuracy < this.prevPos.acc
          ) {
            let coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              acc: position.coords.accuracy,
              timestamp: position.timestamp
            };

            if ( environment.dummyCoords ) coords = this.getDummyCoords(coords);

            this.prevPos = coords;

            this.coords$.next(coords);
          }
        },
        err => {
          console.log(`watchPosition error: ${err.message}`);
          this.debuggingService.debugMessages$.next(`${this.userName}. watchPosition error: ${err.message}`)
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,      // Todo: Figure out what value I want here, and what to do on timeout.
          maximumAge: 5000
        }
    );
  }

  timerForSubscribeToCoords() {
    this.timer = setTimeout(() => {
      // this.debugMessages$.next(`${this.userName}. Timer expired!`);
      let coords = this.coords$.value;
      if ( coords && coords.timestamp ) {
        // this.debugMessages$.next(`${this.userName}. Age of last coords: ${Date.now() - coords.timestamp}`);
        if ( Date.now() - coords.timestamp > 19000 ) {
          // this.debugMessages$.next(`${this.userName}. About to call watchPosition() and timerForWatchPosition() again`);
          navigator.geolocation.clearWatch(this.geoWatch);
          this.subscribeToCoords();
          this.timerForSubscribeToCoords();
        }
      }
    }, 20000);
  }

  emitUpdatedRider() {
    this.userRider$.subscribe(userRider => {
      if ( userRider ) this.socket.emit('updateRiderPosition', _.pick(userRider, '_id', 'token', 'lat', 'lng'));
    });
  }

  emitRemoveRider() {
    this.currentRide$
        .withLatestFrom(this.userService.user$)
        .subscribe(([ ride, user ]) => {
          this.socket.emit('removeRider', _.pick(user, '_id', 'token'));
        });
  }

  listenForFullRiderList() {
    this.socket.on('fullRiderList', riders => {
      if ( riders ) {
        riders = riders.map(rider => new Rider(rider));
      }
      this.riders$.next(riders);
    });
  }

  listenForNewRider() {
    this.socket.on('newRider', rider => {
      rider = new Rider(rider);
      this.newRider$.next(rider);
    });
  }

  listenForUpdateRiderPosition() {
    this.socket.on('updateRiderPosition', updatedRider => {
      this.updatedRider$.next(updatedRider);
    });
  }

  listenForRemoveRider() {
    this.socket.on('removeRider', rider => {
      this.removedRider$.next(rider);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', (rider) => {
      this.disconnectedRider$.next(rider);
    });
  }

  setDummyCoordAdjustments() {
    this.LatDummyAddition = Math.random() * .002 - .001;
    this.LngDummyAddition = Math.random() * .002 - .001;
  }

  setDummyMovements() {
    let LatDummyMovement = Math.random() * .0004 - .0002;
    let LngDummyMovement = Math.random() * .0004 - .0002;

    setTimeout(() => {
      setInterval(() => {
        let coords = this.coords$.value;
        coords.lat += LatDummyMovement;
        coords.lng += LngDummyMovement;
        this.coords$.next(coords);
      }, Math.random() * 6000 + 5000);
    }, 5000);
  }

  getDummyCoords(coords) {
    coords.lat += this.LatDummyAddition;
    coords.lng += this.LngDummyAddition;

    return coords;
  }


}





