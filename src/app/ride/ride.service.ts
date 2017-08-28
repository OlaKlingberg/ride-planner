import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';
import { Ride } from './ride';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class RideService {
  private user: User;

  constructor(private http: Http,
              private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  createRide(model) {
    if ( this.user ) model._creator = this.user._id; // Todo: User *should* exist here, but what if not?
    const requestOptions = this.setHeaders();

    return this.http.post(`${environment.api}/rides`, model, requestOptions)
        .map((response: Response) => {
          return new Ride(response.json());
        });
  }

  deleteRide(rideId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${environment.api}/rides/${rideId}`, requestOptions)
        .map((response: Response) => new Ride(response.json().ride))
        .toPromise(); // Todo: Add error handling.
  }

  setHeaders() {
    const token = JSON.parse(environment.storage.getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

}
