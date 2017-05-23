import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Rider } from '../_models/rider';
import { StatusService } from './status.service';

import Socket = SocketIOClient.Socket;
import { AlertService } from './alert.service';

import * as _ from 'lodash';

import { nameSort } from '../_lib/util';

@Injectable()
export class RiderService {
  private socket: Socket;
  private LatDummyAddition: number;
  private LngDummyAddition: number;
  private userName: string = '';
  private prevPos: { lat: number, lng: number, acc: number } = { lat: null, lng: null, acc: null };
  private timer = null;
  private geoWatch = null;


  constructor(private statusService: StatusService,
              private alertService: AlertService) {
    this.socket = this.statusService.socket;
    this.subscribeToUser();
    this.subscribeToCoords();
    // this.emitUpdatedRider();
    this.emitRemoveRider();
    this.listenForFullRiderList();
    this.listenForNewRider();
    this.listenForUpdateRiderPosition();
    this.listenForRemoveRider();
    this.listenForDisconnectedRider();
    this.setDummyCoordAdjustments();
  }

  subscribeToUser() {
    this.statusService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
    });
  }

  subscribeToCoords() {
    if ( environment.dummyMovement ) this.setDummyMovements();

    // this.statusService.debugMessages$.next(`${this.userName}. watchPosition()`);

    this.geoWatch = navigator.geolocation.watchPosition(position => {
          // console.log(position.coords.latitude, position.coords.longitude, new Date(position.timestamp).toLocaleTimeString('en-US', { hour12: false }));
          // this.statusService.debugMessages$.next(`${this.userName}. New coords yielded! ${new Date().toLocaleTimeString('en-US', { hour12: false })}`);

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

            this.statusService.coords$.next(coords);
          }
        },
        err => {
          console.log(`watchPosition error: ${err.message}`);
          this.statusService.debugMessages$.next(`${this.userName}. watchPosition error: ${err.message}`)
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
      // this.statusService.debugMessages$.next(`${this.userName}. Timer expired!`);
      let coords = this.statusService.coords$.value;
      if ( coords && coords.timestamp ) {
        // this.statusService.debugMessages$.next(`${this.userName}. Age of last coords: ${Date.now() - coords.timestamp}`);
        if ( Date.now() - coords.timestamp > 19000 ) {
          // this.statusService.debugMessages$.next(`${this.userName}. About to call watchPosition() and timerForWatchPosition() again`);
          navigator.geolocation.clearWatch(this.geoWatch);
          this.subscribeToCoords();
          this.timerForSubscribeToCoords();
        }
      }
    }, 20000);
  }

  emitUpdatedRider() {
    this.statusService.userRider$.subscribe(userRider => {
      if ( userRider ) this.socket.emit('updateRiderPosition', _.pick(userRider, '_id', 'token', 'lat', 'lng'));
    });
  }

  emitRemoveRider() {
    this.statusService.currentRide$
        .withLatestFrom(this.statusService.user$)
        .subscribe(([ ride, user ]) => {
          this.socket.emit('removeRider', _.pick(user, '_id', 'token'));
        });
  }

  listenForFullRiderList() {
    this.socket.on('fullRiderList', riders => {
      if ( riders ) {
        riders = riders.map(rider => new Rider(rider));
      }
      this.statusService.riders$.next(riders);
    });
  }

  listenForNewRider() {
    this.socket.on('newRider', rider => {
      rider = new Rider(rider);
      this.statusService.newRider$.next(rider);
    });
  }

  listenForUpdateRiderPosition() {
    this.socket.on('updateRiderPosition', updatedRider => {
      this.statusService.updatedRider$.next(updatedRider);
    });
  }

  listenForRemoveRider() {
    this.socket.on('removeRider', rider => {
      this.statusService.removedRider$.next(rider);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', (rider) => {
      this.statusService.disconnectedRider$.next(rider);
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
        let coords = this.statusService.coords$.value;
        coords.lat += LatDummyMovement;
        coords.lng += LngDummyMovement;
        this.statusService.coords$.next(coords);
      }, Math.random() * 6000 + 5000);
    }, 5000);
  }

  getDummyCoords(coords) {
    coords.lat += this.LatDummyAddition;
    coords.lng += this.LngDummyAddition;

    return coords;
  }


}





