import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

import { MapsAPILoader } from "angular2-google-maps/core";

import { environment } from '../../environments/environment';

import { Rider } from '../_models/rider';
import { StatusService } from './status.service';

import Socket = SocketIOClient.Socket;

@Injectable()
export class RiderService {
  private socket: Socket;

  private currentToken: string;
  private headers: Headers;
  private requestOptions: RequestOptions;

  constructor(private mapsAPILoader: MapsAPILoader,
              private http: Http,
              private statusService: StatusService) {
    // this.mapsAPILoader.load().then(() => {
    // });
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.watchPosition();
    this.watchWhenToEmitRider();
    this.watchWhenToRemoveRider();
    this.listenForRiderList();
  }

  watchPosition(geolocationOptions = null) {
    navigator.geolocation.watchPosition(
        position => this.statusService.coords$.next(position.coords),
        err => this.statusService.coords$.error(err),
        geolocationOptions);
  }

  // Whenever coords, ride, or user changes, provided there are coords and user, emit the rider.
  watchWhenToEmitRider() {
    this.statusService.coords$
        .combineLatest(this.statusService.currentRide$)
        .combineLatest(this.statusService.user$)
        .subscribe(([[coords, ride], user]) => {
          if (coords && ride && user) {
            console.log('watchWhenToEmitRider. About to create new Rider');
            let rider = new Rider(user, coords, ride);
            this.socket.emit('rider', rider, () => {
              // Todo: Do I have any use for this callback?
            });
          }
    });
  }

  watchWhenToRemoveRider() {
    this.statusService.currentRide$
        .withLatestFrom(this.statusService.user$)
        .subscribe(([currentRide, user]) => {
          console.log('watchWhenToRemoveRider. About to create new Rider');
          if (user && !currentRide) this.socket.emit('removeRider', new Rider(user));
        });
  }

  listenForRiderList() {
    this.socket.on('riderList', (riders) => {
      this.statusService.riders$.next(riders);
    });
  }

  getAllRiders() {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users/riders`, this.requestOptions);
  }
}





