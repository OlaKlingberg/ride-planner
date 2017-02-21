import { Component, OnInit } from '@angular/core';
import { marker } from "../../interfaces/marker";

@Component({
  selector: 'ride-riders-map',
  templateUrl: './riders-map.component.html',
  styleUrls: ['./riders-map.component.scss']
})
export class RidersMapComponent implements OnInit {
  // Zoom level
  zoom: number = 14;
  // Start position
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

  constructor() { }

  ngOnInit() {
    this.newMarker = {
      name: 'Ola',
      lat: 40.742706,
      lng: -73.998786,
      draggable: true
    };

    this.markers.push(this.newMarker);
  }

}
