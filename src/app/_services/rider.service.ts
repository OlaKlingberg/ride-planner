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
    this.watchUser();
    this.watchPosition();
    // this.timerForWatchPosition();
    this.createRider();
    this.listenForFullRiderList();
    this.listenForRider();
    this.listenForRemoveRider();
    this.listenForDisconnectedRider();
    this.setDummyCoordAdjustments();
  }

  watchUser() {
    this.statusService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
    });
  }

  watchPosition() {
    this.statusService.debugMessages$.next(`${this.userName}. watchPosition()`);
    // For debugging
    // this.statusService.debugMessages$.next(`${this.userName}. RiderService.watchPosition()`);
    // let i = 0;
    // setInterval(() => {
    //   this.statusService.debugMessages$.next(`${this.userName}. RiderService.watchPosition. Message sent using setInterval: ${i++}`);
    // }, 10000);

    this.geoWatch = navigator.geolocation.watchPosition(position => {
          console.log(position.coords.latitude, position.coords.longitude, new Date(position.timestamp).toLocaleTimeString('en-US', { hour12: false }));
          this.statusService.debugMessages$.next(`${this.userName}. New coords yielded! ${new Date().toLocaleTimeString('en-US', {hour12: false})}`);

          clearTimeout(this.timer);

          this.timerForWatchPosition();

          if (
              Math.abs(position.coords.latitude - this.prevPos.lat) > .0001 ||
              Math.abs(position.coords.longitude - this.prevPos.lng) > .0001 ||
              Math.abs(1 - (position.coords.accuracy / this.prevPos.acc)) > .2
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

    if ( environment.dummyMovement ) this.setDummyMovements();

  }

  timerForWatchPosition() {
    this.statusService.debugMessages$.next(`${this.userName}. Timer started.`);
    this.timer = setTimeout(() => {
      this.statusService.debugMessages$.next(`${this.userName}. Timer expired!`);
      let coords = this.statusService.coords$.value;
      if ( coords && coords.timestamp ) {
        this.statusService.debugMessages$.next(`${this.userName}. Age of last coords: ${Date.now() - coords.timestamp}`);
        if ( Date.now() - coords.timestamp > 19000 ) {
          this.statusService.debugMessages$.next(`${this.userName}. About to call watchPosition() and timerForWatchPosition() again`);
          navigator.geolocation.clearWatch(this.geoWatch);
          this.watchPosition();
          this.timerForWatchPosition();
        }

      }

    }, 20000);
  }

  addRider(rider) {
    let riders = this.statusService.riders$.value;
    riders.unshift(rider);
    riders = _.uniqBy(riders, '_id');
    riders.sort(nameSort);
    this.statusService.riders$.next(riders);
  }

  // Whenever coords changes, provided coords, ride, and user all exist, emit the rider.
  createRider() {
    this.statusService.coords$
        .combineLatest(this.statusService.currentRide$, this.statusService.user$)
        .subscribe(([ coords, ride, user ]) => {
          if ( coords && ride && user ) {
            this.statusService.debugMessages$.next(`${this.userName}. Lat: ${coords.lat}. Lng: ${coords.lng}`);
            let rider = new Rider(user, coords, ride);
            this.socket.emit('rider', rider, () => {
              // Todo: Do I have any use for this callback?
            });
          }
        });
  }

  removeRider() {
    let rider = new Rider(this.statusService.user$.value);
    rider.ride = this.statusService.currentRide$.value;

    this.socket.emit('removeRider', rider, () => {
      this.alertService.success("You have been logged out from the ride.");
      this.statusService.currentRide$.next(null);
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

  listenForRider() {
    this.socket.on('rider', rider => {
      // Todo: rider has email, which it should not.
      let newOrUpdatedRider = new Rider(rider);
      this.addRider(newOrUpdatedRider);
    });
  }

  listenForRemoveRider() {
    this.socket.on('removeRider', riderToRemove => {
      let riders = this.statusService.riders$.value;
      riders = riders.filter(rider => rider._id !== riderToRemove._id);
      this.statusService.riders$.next(riders);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', (rider) => {
      let disconnectedRider = new Rider(rider);
      this.addRider(disconnectedRider);
    });
  }

  setDummyCoordAdjustments() {
    this.LatDummyAddition = Math.random() * .006 - .003;
    this.LngDummyAddition = Math.random() * .006 - .003;
  }

  setDummyMovements() {
    let LatDummyMovement = Math.random() * .0006 - .0003;
    let LngDummyMovement = Math.random() * .0006 - .0003;

    setTimeout(() => {
      setInterval(() => {
        let coords = this.statusService.coords$.value;
        coords.lat += LatDummyMovement;
        coords.lng += LngDummyMovement;
        this.statusService.coords$.next(coords);
      }, Math.random() * 3000 + 4000);
    }, 5000);
  }

  getDummyCoords(coords) {
    coords.lat += this.LatDummyAddition;
    coords.lng += this.LngDummyAddition;

    return coords;
  }


}





