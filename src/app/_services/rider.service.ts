import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Rider } from '../_models/rider';
import { StatusService } from './status.service';

import Socket = SocketIOClient.Socket;
import { AlertService } from './alert.service';

import * as _ from 'lodash';

@Injectable()
export class RiderService {
  private socket: Socket;
  private LatDummyAddition: number;
  private LngDummyAddition: number;


  constructor(private statusService: StatusService,
              private alertService: AlertService) {
    this.socket = this.statusService.socket;
    this.listenForFullRiderList();
    this.listenForRider();
    this.listenForRemoveRider();
    this.setDummyCoordAdjustments();
    this.watchPosition();
    this.createRider();
  }

  watchPosition(geolocationOptions = null) {
    navigator.geolocation.watchPosition(
        position => {
          let coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          if ( environment.dummyCoords ) coords = this.getDummyCoords(coords);
          this.statusService.coords$.next(coords);
        },
        err => this.statusService.coords$.error(err), geolocationOptions
    );

    if (environment.dummyMovement) {
      let LatDummyMovement = Math.random() * .0006 - .0003;
      let LngDummyMovement = Math.random() * .0006 - .0003;

      setTimeout(() => {
        setInterval(() => {
          let coords = this.statusService.coords$.value;
          coords.lat += LatDummyMovement;
          coords.lng += LngDummyMovement;
          this.statusService.coords$.next(coords);
        }, Math.random() * 3000 + 2000);
      }, 5000);
    }
  }

  addRider(rider) {
    let riders = this.statusService.riders$.value;
    riders.unshift(rider);
    riders = _.uniqBy(riders, '_id');
    this.statusService.riders$.next(riders);
  }

  // Whenever coords changes, provided all coords, ride, and user all exist, emit the rider.
  createRider() {
    console.log("RiderService.emitRider()");
    this.statusService.coords$
        .combineLatest(this.statusService.currentRide$, this.statusService.user$)
        .subscribe(([ coords, ride, user ]) => {
          if ( coords && ride && user ) {
            let rider = new Rider(user, coords, ride);
            console.log("RiderService.emitRider. About to emit rider.", rider);
            this.socket.emit('rider', rider, () => {
              // Todo: Do I have any use for this callback?
            });
          }
        });
  }

  removeRider() {
    let rider = new Rider(this.statusService.user$.value);
    rider.ride = this.statusService.currentRide$.value;

    console.log("RiderService.removeRider. About to emit removeRider. rider:", rider);
    this.socket.emit('removeRider', rider, () => {
      this.alertService.success("You have been logged out from the ride.");
      this.statusService.currentRide$.next(null);
    });
  }

  listenForFullRiderList() {
    this.socket.on('fullRiderList', riders => {
      console.log("RiderService.listenForFullRiderList. riders:", riders);
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
      console.log("on:removeRider:", riderToRemove);
      let riders = this.statusService.riders$.value;
      riders = riders.filter(rider => rider._id !== riderToRemove._id);
      this.statusService.riders$.next(riders);
    });
  }

  setDummyCoordAdjustments() {
    this.LatDummyAddition = Math.random() * .006 - .003;
    this.LngDummyAddition = Math.random() * .006 - .003;
  }

  getDummyCoords(coords) {
    coords.lat += this.LatDummyAddition;
    coords.lng += this.LngDummyAddition;

    return coords;
  }

}





