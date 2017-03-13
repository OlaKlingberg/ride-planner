import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { MapsAPILoader } from "angular2-google-maps/core"
import { rider } from "../../interfaces/rider";

import { environment } from '../../environments/environment';


@Component({
  selector: 'rp-riders-map3',
  templateUrl: './riders-map3.component.html',
  styleUrls: [ './riders-map3.component.scss' ]
})
export class RidersMap3Component implements OnInit {
  private socket;

  private lat;
  private lng;

  private myMap;

  private rider: rider;
  private riders: rider[];

  private marker;
  private markers = [];

  @ViewChild("mapDiv")
  public mapElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.socket = io(environment.api);  // io is made available through import into index.html.

    this.mapsAPILoader.load().then(() => {
      this.createMap();
    })
  }

  createMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      this.myMap = new google.maps.Map(this.mapElementRef.nativeElement, {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 15
      });

      this.addRiderToRiders();

    })
  }

  addRiderToRiders() {
    this.rider = {
      name: "Ola",
      position: {
        lat: this.lat,
        lng: this.lng,
      },
      draggable: true
    };

    this.socket.emit('newRider', this.rider, (err) => {
      if (err) {
        alert(err);
      } else {
        console.log('newRider. No error!');
      }
    });

    this.socket.on('updateRidersArray', (riders) => {
      this.riders = riders;

      for (let i = 0; i < this.riders.length; i++) {
        if (this.riders[i]) {

          let marker = new google.maps.Marker(this.riders[i]);
          marker.setMap(this.myMap);
          marker.setAnimation(google.maps.Animation.DROP);

        }

      }
    });

  }




}
