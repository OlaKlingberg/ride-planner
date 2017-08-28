import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Cue } from './cue';
import { Cuesheet } from './cuesheet';
import { environment } from "../../environments/environment";
import { User } from '../user/user';
import { UserService } from '../user/user.service';


@Injectable()
export class CuesheetService {
  private user: User;

  constructor(private http: Http,
              private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  createCue(cuesheetId: any, cue: any, insertBeforeId: string) {
    const requestOptions = this.setHeaders();

    return this.http.post(`${environment.api}/cuesheets/cues`, { cuesheetId, cue, insertBeforeId }, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  createCuesheet(model) {
    if ( this.user ) model._creator = this.user._id;   // Todo: User *should* exist here, but what if not?
    const requestOptions = this.setHeaders();

    return this.http.post(`${environment.api}/cuesheets`, model, requestOptions)
        .map((response: Response) => {
          return new Cuesheet(response.json());
        });
  }

  deleteCue(cuesheetId: any, cueId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${environment.api}/cuesheets/${cuesheetId}/cues/${cueId}`, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  deleteCuesheet(cuesheetId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${environment.api}/cuesheets/${cuesheetId}`, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise(); // Todo: Add error handling.
  }

  getAllCuesheets() {
    const requestOptions = this.setHeaders();

    return this.http.get(`${environment.api}/cuesheets`, requestOptions)
        .map((response: Response) => {
          return response.json().cuesheets.map(cuesheet => new Cuesheet(cuesheet));
        });
  }

  getCuesheet(_id) {
    const requestOptions = this.setHeaders();

    return this.http.get(`${environment.api}/cuesheets/${_id}`, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise();
  }

  setHeaders() {
    const token = JSON.parse(environment.storage.getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

  updateCue(_id: string, cue: any) {
    const requestOptions = this.setHeaders();

    return this.http.patch(`${environment.api}/cuesheets/cues/${_id}`, cue, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  updateCuesheet(_id: string, cuesheet: any) {
    const requestOptions = this.setHeaders();

    return this.http.patch(`${environment.api}/cuesheets/${_id}`, cuesheet, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise();
  }
}
