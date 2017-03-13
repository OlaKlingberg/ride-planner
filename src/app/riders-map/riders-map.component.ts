import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rp-riders-map',
  templateUrl: './riders-map.component.html',
  styleUrls: ['./riders-map.component.scss']
})
export class RidersMapComponent implements OnInit {
  lat: number = 40.22;
  lng: number = -74.01;
  pos: string = `${this.lat},${this.lng}`;
  animation: any;


  constructor() { }

  ngOnInit() {

  }

  onMapReady(map) {
    let marker = new google.maps.Marker({
      position: {
        lat: this.lat,
        lng: this.lng
      },
      title: 'Whatever',
      animation: google.maps.Animation.DROP,
      map
    });


  }

  onMarkerInit(marker) {
    console.log('onMarkerInit');
  }

}
