import { Component, OnInit } from '@angular/core';
import { rider } from "../../interfaces/rider";

import { environment } from '../../environments/environment';
import { AuthenticationService } from "../_services/authentication.service";
import { MapService } from "../_services/map.service";
import { SebmGoogleMap } from "angular2-google-maps/core";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { User } from "../_models/user";
import { SocketService } from '../_services/socket.service';

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  private position$: Observable<any>;
  private user$: BehaviorSubject<User>;

  private lat: number;
  private lng: number;
  private zoom: number = 15;
  private user: User;
  private riders: User[];

  constructor(private mapService: MapService,
              private authenticationService: AuthenticationService,
              private socketService: SocketService) {
  }

  ngOnInit() {
    this.getUser();
    this.watchPosition();
    // this.emitRider();
    this.listenForRiders();
  }

  getUser() {
    this.user$ = this.authenticationService.user$;
    this.user$.subscribe(user => {
      if ( user ) {
        this.user = user as User;
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

  emitRider() {
    this.user$.subscribe(user => {
      if ( user ) {
        this.socketService.emitRider(this.user);
      }
    });
  }

  listenForRiders() {
    this.socketService.riders$.subscribe((riders) => {
      if ( riders.length > 0 ) {
        this.riders = riders.map(rider => new User(rider)
        );
      }
    });
  }

}
