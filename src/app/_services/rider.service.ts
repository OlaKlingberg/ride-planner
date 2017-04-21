import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs/Rx";

import { MapsAPILoader } from "angular2-google-maps/core";

import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Rider } from '../_models/rider';
import { Subscription } from 'rxjs/Subscription';
import { Http, RequestOptions, Headers } from '@angular/http';


@Injectable()
export class RiderService {
  private socket: Socket;

  public rides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);

  private geoWatchId: number;
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  private coordsSub: Subscription;
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);

  private currentToken: string;
  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(private mapsAPILoader: MapsAPILoader,
              private authenticationService: AuthenticationService,
              private http: Http) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.listenForRides();
    this.listenForRiderList();
    this.watchPosition();
  }

  listenForRides() {
    this.socket.on('rides', (rides) => {
      this.rides$.next(rides);
    });

  }

  listenForRiderList() {
    this.socket.on('riderList', (riders) => {
      console.log("RiderService.listenForRiderList", riders);
      this.riders$.next(riders);
    });
  }

  watchPosition(geolocationOptions = null) {
    this.geoWatchId = navigator.geolocation.watchPosition(
        position => {
          this.coords$.next(position.coords);
        },
        err => {
          this.coords$.error(err);
        }, geolocationOptions);
  }

  emitRider(user) {
    this.coordsSub = this.coords$.subscribe((coords) => {
      if ( coords ) {

        let rider = new Rider(user);
        rider.lat = coords.latitude;
        rider.lng = coords.longitude;

        this.socket.emit('rider', rider, () => {
          // Todo: Do I have any use for this callback function?
        });
      }
    });
  }

  removeRider() {
    if ( this.coordsSub ) this.coordsSub.unsubscribe();
    if ( this.geoWatchId ) navigator.geolocation.clearWatch(this.geoWatchId);
    this.socket.emit('removeRider');
  }

  getAllRiders() {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users/riders`, this.requestOptions);
  }
}








