import { Component, OnInit } from '@angular/core';
import { rider } from "../../interfaces/rider";

import { environment } from '../../environments/environment';
import { AuthenticationService } from "../_services/authentication.service";
import { MapService } from "../_services/map.service";
import { SebmGoogleMap } from "angular2-google-maps/core";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { User } from "../_models/user";

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  // private socket;
  // public ridersMap;
  private position$: Observable<any>;
  private user$: BehaviorSubject<User>;

  // private coords: Object;
  private lat: number;
  private lng: number;
  private zoom: number = 15;
  private user: User;
  private label: string;


  // Riders
  // newRider: rider;
  // riders: rider[] = [];
  // url: string;

  constructor(private mapService: MapService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.getUser();
    this.watchPosition();


    // this.socket = io(environment.api);  // io is made available through import into index.html.

    // navigator.geolocation.getCurrentPosition(position => {
    //   this.newRider = {
    //     name: 'Ola',
    //     position: {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     },
    //     draggable: true
    //   };
    //
    //   this.socket.emit('newRider', this.newRider, (err) => {
    //     if (err) {
    //       alert(err);
    //     } else {
    //       console.log('newRider. No error!');
    //     }
    //   });
    //
    //
    // });
    //
    // this.socket.on('updateRiders', (riders) => {
    //   console.log('updateRiders');
    //   this.riders = riders;
    //   console.log(this.riders);
    // });

  }


  getUser() {
    this.user$ = this.authenticationService.user$;
    this.user$.subscribe(user => {
      if ( user ) {
        this.user = user as User;
        this.label = user.fname.substr(0, 1) + user.lname.substr(0, 1);
        // console.log("initials:", this.user.initials);
      }

    });
  }

  watchPosition() {
    this.position$ = this.mapService.watchPosition();
    this.position$.subscribe(position => {
      if ( position ) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      }
    });
  }


}
