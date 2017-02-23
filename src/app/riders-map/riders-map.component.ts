import { Component, OnInit } from '@angular/core';
import { marker } from "../../interfaces/marker";

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

  // Markers
  newMarker: marker;
  markers: marker[] = [];
  url: string;

  constructor() {
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {

      this.newMarker = {
        name: 'Ola',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        draggable: true
      };

      this.markers.push(this.newMarker);




    });

  }

}
