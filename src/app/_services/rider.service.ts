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


  constructor(private statusService: StatusService,
              private alertService: AlertService) {
    this.socket = this.statusService.socket;
    this.watchPosition();
    this.createRider();
    this.listenForFullRiderList();
    this.listenForRider();
    this.listenForRemoveRider();
    this.listenForDisconnectedRider();
    this.setDummyCoordAdjustments();
  }

  watchPosition() {
    this.statusService.debugMessages$.next("RiderService.watchPosition()");

    let i = 0;
    setInterval(() => {
      this.statusService.debugMessages$.next(`RiderService.watchPosition. Message sent using setInterval: ${i++}`);
    }, 9000);




    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
          position => {
            let coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            this.statusService.debugMessages$.next(`Lat: ${coords.lat}. Lng: ${coords.lng}`);
            if ( environment.dummyCoords ) coords = this.getDummyCoords(coords);
            console.log("About to call .coords$.next(coords) with", coords);
            this.statusService.coords$.next(coords);
          },
          err => {
            // Sets a dummy position if watchPosition times out, just to test that the socket works.
            this.statusService.debugMessages$.next(err);
            let coords = { lat: 42, lng: -75};
            this.statusService.coords$.next(coords);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,      // Todo: Figure out what value I want here, and what to do on timeout.
            maximumAge: 10000
          }
      );
    }, 9000);


    if ( environment.dummyMovement ) this.setDummyMovements();

  }

  addRider(rider) {
    let riders = this.statusService.riders$.value;
    riders.unshift(rider);
    riders = _.uniqBy(riders, '_id');
    riders.sort(nameSort);
    // console.log("addRider. riders:", riders);
    this.statusService.riders$.next(riders);
  }

  // Whenever coords changes, provided coords, ride, and user all exist, emit the rider.
  createRider() {
    console.log("RiderService.emitRider()");
    this.statusService.coords$
        .combineLatest(this.statusService.currentRide$, this.statusService.user$)
        .subscribe(([ coords, ride, user ]) => {
          if ( coords && ride && user ) {
            let rider = new Rider(user, coords, ride);
            // console.log(`RiderService.emitRider. About to emit rider:, ${rider.fname} ${rider.lname}`);
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
      console.log("RiderService.listenForFullRiderList. riders:", riders);
      if ( riders ) {
        riders = riders.map(rider => new Rider(rider));
      }
      this.statusService.riders$.next(riders);
    });
  }

  listenForRider() {
    this.socket.on('rider', rider => {
      console.log(`RiderService.listenForRider. rider: ${rider.fname} ${rider.lname}. disconnected: ${rider.disconnected}`);
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

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', (rider) => {
      console.log("listenForDisconnectedRider. rider:", rider);
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





