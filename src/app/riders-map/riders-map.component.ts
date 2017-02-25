import { Component, OnInit } from '@angular/core';
import { riderMarker } from "../../interfaces/rider-marker";

import { environment } from '../../environments/environment';

@Component({
  selector: 'ride-riders-map',
  templateUrl: './riders-map.component.html',
  styleUrls: [ './riders-map.component.scss' ]
})
export class RidersMapComponent implements OnInit {
  // Zoom level
  zoom: number = 16;

  // Map position
  lat: number = 40.742706;
  lng: number = -73.998786;

  // Values
  markerName: string;
  markerLat: string;
  markerLng: string;
  markerDraggable: string;

  // Riders
  newRiderMarker: riderMarker;
  riderMarkers: riderMarker[] = [];
  url: string;

  // socket.io
  socket = null;

  constructor() {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.newRiderMarker = {
        name: 'Ola',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        draggable: true
      };
      this.riderMarkers.push(this.newRiderMarker);
    });

    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.socket.on('connect', () => {
      this.socket.emit('newRider', this.newRiderMarker, function (err) {
        if (err) {
          alert(err);
        } else {
          console.log('newRider. No error!');
        }
      })


    });


  }

}
