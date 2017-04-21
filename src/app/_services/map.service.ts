import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs/Rx";

import { MapsAPILoader } from "angular2-google-maps/core";

import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Rider } from '../_models/rider';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class MapService {
  private socket: Socket;

  private geoWatchId: number;
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  private coordsSub: Subscription;
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);
  public selectedRide$: BehaviorSubject<string> = new BehaviorSubject(null);


  constructor(private mapsAPILoader: MapsAPILoader,
              private authenticationService: AuthenticationService) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.watchPosition();
    this.listenForRiderList();
  }

  watchPosition(geolocationOptions = null) {
    this.geoWatchId = navigator.geolocation.watchPosition(
        position => {
          this.coords$.next(position.coords);
        },
        err => {
          this.coords$.error(err);
        }, geolocationOptions);
  }

  emitRider(user) {
    this.coordsSub = this.coords$.subscribe((coords) => {
      if (coords) {

        let rider = new Rider(user);
        rider.lat = coords.latitude;
        rider.lng = coords.longitude;

        this.socket.emit('rider', rider, () => {
          // Todo: Do I have any use for this callback function?
        });
      }
    });
  }

  listenForRiderList() {
    this.socket.on('riderList', (riders) => {
      console.log("MapService.listenForRiderList", riders);
      this.riders$.next(riders);
    });
  }

  removeRider() {
    if (this.coordsSub) this.coordsSub.unsubscribe();
    if (this.geoWatchId) navigator.geolocation.clearWatch(this.geoWatchId);

    const user = this.authenticationService.user$.value;
    console.log("MapService.removeRider", user);

    this.socket.emit('removeRider', user);
  }

}








