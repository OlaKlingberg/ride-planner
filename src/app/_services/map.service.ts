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
    this.mapsAPILoader.load().then(() => {
    });
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
    // console.log(rider);
    const markerOptions = {
      map: ridersMap,
      title: rider.fname,
      label: rider.fname.substr(0, 1) + rider.lname.substr(0, 1),
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      draggable: true
    };

    const riderMarker = new google.maps.Marker(markerOptions);

    const infoWindow = new google.maps.InfoWindow;

    infoWindow.setContent(`<div class="olas-style">${rider.fname} ${rider.lname}</div>`)

    riderMarker.addListener('click', function () {
      infoWindow.open(ridersMap, riderMarker);
    });


  }

  // removeMarker() {
  //
  // }

}







