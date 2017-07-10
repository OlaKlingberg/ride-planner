import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Cuesheet } from '../_models/cuesheet';
import { UserService } from './user.service';
import { User } from '../_models/user';
import { Cue } from '../_models/cue';


@Injectable()
export class CuesheetService {
  private user: User;

  constructor(private http: Http,
              private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  setHeaders() {
    let token = JSON.parse(environment.storage.getItem('rpToken'));
    let headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

  create(model) {
    if ( this.user ) model._creator = this.user._id;   // Todo: User *should* exist here, but what if not?
    let requestOptions = this.setHeaders();

    return this.http.post(`${environment.api}/cuesheets`, model, requestOptions)
        .map((response: Response) => {
          return new Cuesheet(response.json());
        });
  }

  getAllCuesheets() {
    let requestOptions = this.setHeaders();

    return this.http.get(`${environment.api}/cuesheets`, requestOptions)
        .map((response: Response) => {
          return response.json().cuesheets.map(cuesheet => new Cuesheet(cuesheet));
        });
  }

  getCuesheet(_id) {
    let requestOptions = this.setHeaders();

    return this.http.get(`${environment.api}/cuesheets/${_id}`, requestOptions)
        .map((response: Response) => new Cuesheet(response.json().cuesheet))
        .toPromise();
  }

  saveCue(cuesheetId: any, cue: any, insertBeforeId: string) {
    let requestOptions = this.setHeaders();

    return this.http.post(`${environment.api}/cuesheets/cues`, { cuesheetId, cue, insertBeforeId }, requestOptions)
        .map((response: Response) => {
          console.log("response.json():", response.json());
          return new Cue(response.json());
        }).toPromise();
  }

  deleteCue(cuesheetId: any, cueId: any) {
    let requestOptions = this.setHeaders();

    return this.http.delete(`${environment.api}/cuesheets/${cuesheetId}/cues/${cueId}`, requestOptions)
        .map((response: Response) => {
          return new Cue(response.json());
        }).toPromise();
  }



}
