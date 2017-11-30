import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import Socket = SocketIOClient.Socket;

import { Ride } from './ride';
import { RideSubjectService } from './ride-subject.service';
import { SettingsService } from '../settings/settings.service';
import { SocketService } from '../core/socket.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class RideService {
  private socket: Socket;
  private user: User;

  constructor(private http: Http,
              private rideSubjectService: RideSubjectService,
              private settingsService: SettingsService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
    this.onAvailableRides();
    this.subscribeToUser();
  }

  createRide(model) {
    if ( this.user ) model._creator = this.user._id; // Todo: User *should* exist here, but what if not?
    const requestOptions = this.setHeaders();

    return this.http.post(`${this.settingsService.api}/rides`, model, requestOptions)
        .map((response: Response) => {
          return new Ride(response.json());
        });
  }

  deleteRide(rideId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${this.settingsService.api}/rides/${rideId}`, requestOptions)
        .map((response: Response) => new Ride(response.json().ride))
        .toPromise(); // Todo: Add error handling.
  }

  emitGiveMeAvailableRides() {
    this.socket.emit('giveMeAvailableRides');
  }

  emitLeaveRide() {
    this.socket.emit('leaveRide');
  }

  onAvailableRides() {
    this.socket.on('availableRides', (availableRides: Ride[] )=> {
      this.rideSubjectService.availableRides$.next(availableRides);
    })
  }

  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

}
