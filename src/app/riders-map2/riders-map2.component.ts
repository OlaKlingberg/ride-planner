import { Component, OnInit } from '@angular/core';
import { rider } from "../../interfaces/rider";

import { environment } from '../../environments/environment';

@Component({
  selector: 'ride-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  // Zoom level
  zoom: number = 16;

  // Map position
  lat: number = 40.742706;
  lng: number = -73.998786;

  // Values
  riderName: string;
  riderLat: string;
  riderLng: string;
  riderDraggable: string;

  // Riders
  newRider: rider;
  riders: rider[] = [];
  url: string;

  // socket.io
  socket = null;

  constructor() {}

  ngOnInit() {
    this.socket = io(environment.api);  // io is made available through import into index.html.

    navigator.geolocation.getCurrentPosition(position => {
      this.newRider = {
        name: 'Ola',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        draggable: true
      };

      this.socket.emit('newRider', this.newRider, (err) => {
        if (err) {
          alert(err);
        } else {
          console.log('newRider. No error!');
        }
      });


    });

    this.socket.on('ridersUpdate', (riders) => {
      console.log("this.socket.on('ridersUpdate') ...");
      this.riders = riders;
    });

  }

  riderDragEnd() {

  }

}
