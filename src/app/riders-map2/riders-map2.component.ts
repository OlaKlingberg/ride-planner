import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: ['./riders-map2.component.scss']
})
export class RidersMap2Component implements OnInit {
  lat: number = 40.22;
  lng: number = -74.01;
  pos: string = `${this.lat},${this.lng}`;
  animation: any;


  constructor() { }

  ngOnInit() {

  }

  onMapReady(map) {
    console.log('onMapReady');
    console.log('map', map);
    console.log(google);
    // this.animation = google.maps.Animation.DROP;

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
    console.log(google);
    console.log('marker', marker);
  }

}
