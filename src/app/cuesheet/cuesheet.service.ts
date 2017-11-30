import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';

import { Cue } from './cue';
import { Cuesheet } from './cuesheet';
import { SettingsService } from '../settings/settings.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';


@Injectable()
export class CuesheetService {
  swipes$: Subject<string> = new Subject();

  private user: User;

  constructor(private http: Http,
              private settingsService: SettingsService,
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

    return this.http.post(`${this.settingsService.api}/cuesheets/cues`, { cuesheetId, cue, insertBeforeId }, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  createCuesheet(model) {
    if ( this.user ) model._creator = this.user._id;   // Todo: User *should* exist here, but what if not?
    const requestOptions = this.setHeaders();

    return this.http.post(`${this.settingsService.api}/cuesheets`, model, requestOptions)
        .map((response: Response) => {
          return new Cuesheet(response.json());
        });
  }

  deleteCue(cuesheetId: any, cueId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${this.settingsService.api}/cuesheets/${cuesheetId}/cues/${cueId}`, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  deleteCuesheet(cuesheetId: any) {
    const requestOptions = this.setHeaders();

    return this.http.delete(`${this.settingsService.api}/cuesheets/${cuesheetId}`, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise(); // Todo: Add error handling.
  }


  getCuesheet(_id) {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/cuesheets/${_id}`, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise();
  }

  getCuesheetList () {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/cuesheets`, requestOptions)
        .map((response: Response) => {
          return response.json().cuesheets.map(cuesheet => new Cuesheet(cuesheet));
        });
  }

  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
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

    return this.http.patch(`${this.settingsService.api}/cuesheets/cues/${_id}`, cue, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }

  updateCuesheet(_id: string, cuesheet: any) {
    const requestOptions = this.setHeaders();

    return this.http.patch(`${this.settingsService.api}/cuesheets/${_id}`, cuesheet, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise();
  }
}
