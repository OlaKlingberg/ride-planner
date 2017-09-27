import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { HostListener, Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';

import { Cue } from './cue';
import { Cuesheet } from './cuesheet';
import { environment } from "../../environments/environment";
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class CuesheetService {
  swipes$: Subject<string> = new Subject();

  private user: User;

  constructor(private http: Http,
              private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });

    window.addEventListener("message", (event) => {
      if (event.data === 'up' || event.data === 'down') this.swipes$.next(event.data);
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

  getCuesheetList () {
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

  swipeDown(windowRef) {
    windowRef.postMessage('down', '*');
  }

  swipeUp(windowRef) {
    windowRef.postMessage('up', '*');
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
