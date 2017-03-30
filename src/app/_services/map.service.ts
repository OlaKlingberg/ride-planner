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
    this.mapsAPILoader.load().then(() => { });
    this.position$ = new BehaviorSubject(null);
  }

  watchPosition(geolocationOptions = null) {
    const watchId = navigator.geolocation.watchPosition(
        loc => {
          this.position$.next(loc);
        },
        err => {
          this.position$.error(err);
        }, geolocationOptions);

    return this.position$;
  }

  createMap(mapElementRef, position) {
    const riderMap = new google.maps.Map(mapElementRef.nativeElement, {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      zoom: 15
    });

    return riderMap;
  }

  createRiderMarker(ridersMap, position, rider) {
    const markerOptions = {
      name: rider.fname,
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      draggable: true
    };

    console.log(markerOptions);
    const riderMarker = new google.maps.Marker(markerOptions);

    riderMarker.setMap(ridersMap);




  }

  // removeMarker() {
  //
  // }

}







