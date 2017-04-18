import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs/Rx";

import { MapsAPILoader } from "angular2-google-maps/core";

import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { AuthenticationService } from './authentication.service';
import { Rider } from '../_models/rider';


@Injectable()
export class MapService {
  private socket: Socket;

  // public position$: BehaviorSubject<any> = new BehaviorSubject(null);
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);


  constructor(private mapsAPILoader: MapsAPILoader,
              private authenticationService: AuthenticationService) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.watchPosition();
    this.listenForUpdatedRiderList();
  }

  watchPosition(geolocationOptions = null) {
    const watchId = navigator.geolocation.watchPosition(
        position => {
          this.coords$.next(position.coords);
        },
        err => {
          this.coords$.error(err);
        }, geolocationOptions);
  }

  emitRider(user) {
    this.coords$.subscribe((coords) => {
      if (coords) {
        console.log(coords);

        let rider = new Rider(user);
        rider.lat = coords.latitude;
        rider.lng = coords.longitude;

        this.socket.emit('newRider', rider, () => {
          // Todo: Do I have any use for this callback function?
        });
      }
    });
  }

  listenForUpdatedRiderList() {
    this.socket.on('updatedRiderList', (riders) => {
      console.log("MapService.listenForNewRiderList", riders);
      this.riders$.next(riders);
    })
  }

  removeRider() {
    const user$ = this.authenticationService.user$.subscribe((user) => {
      if ( user ) {
        this.socket.emit('removeRider', user);
      }
    });
    user$.unsubscribe();
  }

}








