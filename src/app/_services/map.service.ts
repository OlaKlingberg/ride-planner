import { Injectable } from '@angular/core';

import { Subject } from "rxjs/Rx";
import { BehaviorSubject } from "rxjs/Rx";
import * as Rx from "rxjs/Rx";

import { rider } from "../../interfaces/rider";
import { MapsAPILoader } from "angular2-google-maps/core";

@Injectable()
export class MapService {
  position$: BehaviorSubject<any>;

  constructor(private mapsAPILoader: MapsAPILoader) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.position$ = new BehaviorSubject(null);
  }

  watchPosition(geolocationOptions = null) {
    const watchId = navigator.geolocation.watchPosition(
        position => {
          this.position$.next(position);
        },
        err => {
          this.position$.error(err);
        }, geolocationOptions);

    return this.position$;
  }


}







