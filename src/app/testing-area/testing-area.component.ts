import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './testing-area.component.html',
  styleUrls: ['./testing-area.component.scss']
})
export class TestingAreaComponent implements OnInit {

  ngOnInit() {
    const dist = this.distanceInKmBetweenEarthCoordinates(40.2098623, -74.0062748, 40.2094081, -74.00417899999999);
    console.log(dist);
  }


  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lng1, lat2, lng2) {
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2-lat1);
    const dLon = this.degreesToRadians(lng2-lng1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusKm * c;
  }



}
