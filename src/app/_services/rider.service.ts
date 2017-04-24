import { Injectable } from '@angular/core';

import { MapsAPILoader } from "angular2-google-maps/core";

import { environment } from '../../environments/environment';

import { Rider } from '../_models/rider';
import { StatusService } from './status.service';

import Socket = SocketIOClient.Socket;

@Injectable()
export class RiderService {
  private socket: Socket;
  private dummyLat: number;
  private dummyLng: number;

  constructor(private mapsAPILoader: MapsAPILoader,
              private statusService: StatusService) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.watchPosition();
    this.watchWhenToEmitRider();
    this.watchWhenToRemoveRider();
    this.listenForRiderList();
    this.setDummyCoords();
  }

  watchPosition(geolocationOptions = null) {
    navigator.geolocation.watchPosition(
        position => {
          let coords = {lat: position.coords.latitude, lng: position.coords.longitude};
          if ( environment.dummyCoords) coords = this.getDummyCoords(coords);
          this.statusService.coords$.next(coords);
        },
        err => this.statusService.coords$.error(err),
        geolocationOptions
    );
  }

  // Whenever coords, ride, or user changes, provided all three values exist, emit the rider.
  watchWhenToEmitRider() {
    this.statusService.coords$
        .combineLatest(this.statusService.currentRide$)
        .combineLatest(this.statusService.user$)
        .subscribe(([ [ coords, ride ], user ]) => {
          if ( coords && ride && user ) {
            let rider = new Rider(user, coords, ride);
            this.socket.emit('rider', rider, () => {
              // Todo: Do I have any use for this callback?
            });
          }
        });
  }

  watchWhenToRemoveRider() {
    this.statusService.currentRide$
        .withLatestFrom(this.statusService.user$)
        .subscribe(([ currentRide, user ]) => {
          console.log('watchWhenToRemoveRider. About to create new Rider');
          if ( user && !currentRide ) this.socket.emit('removeRider', new Rider(user));
        });
  }

  listenForRiderList() {
    this.socket.on('riderList', (riders) => {
      if ( riders ) {
        riders = riders.map(rider => new Rider(rider));
      }
      this.statusService.riders$.next(riders);
    });
  }

  setDummyCoords() {
    this.dummyLat = Math.random() * .02 - .01;
    this.dummyLng = Math.random() * .02 - .01;
  }

  getDummyCoords(coords) {
    coords.lat += this.dummyLat;
    coords.lng += this.dummyLng;

    return coords;
  }

}





