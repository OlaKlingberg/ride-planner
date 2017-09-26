import { Injectable } from '@angular/core';
import { Cuesheet } from './cuesheet';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CuesheetService } from './cuesheet.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Http, RequestOptions, Headers, Response } from "@angular/http";

import { environment } from "../../environments/environment";
import { Router } from '@angular/router';


@Injectable()
export class CuesheetDemoService {
  public cuesheets$: BehaviorSubject<Cuesheet[]> = new BehaviorSubject([]);

  constructor(private cuesheetService: CuesheetService,
              private http: Http,
              private router: Router) {
    this.cuesheetService.getAllCuesheets().toPromise().then(cuesheets => {

      this.cuesheets$.next(cuesheets);
    });
  }

  createCuesheet(model) {
    model.cues = {};

    model._creator = {
      _id: model._creator,
      fname: 'Jane',
      lname: 'Doe'
    };

    model._id = Math.floor(Math.random() * 1000000).toString();

    let cuesheets = this.cuesheets$.value;
    cuesheets.push(new Cuesheet(model));
    this.cuesheets$.next(cuesheets);

    return model;
  }

  cuesheetsPromise() {
    let cuesheetsPromise = new Promise((resolve, reject) => {
      const subscription = this.cuesheets$.subscribe(cuesheets => {
        if ( cuesheets.length >= 1 ) {
          resolve(cuesheets);
          subscription.unsubscribe();
        }
      })
    });

    return cuesheetsPromise;
  }

  deleteCuesheet(id) {
    let cuesheets = this.cuesheets$.value;
    cuesheets = cuesheets.filter(cuesheet => cuesheet._id !== id);
    this.cuesheets$.next(cuesheets);
  }

  getCuesheet(_id) {
    return this.cuesheetsPromise().then((cuesheets: Cuesheet[]) => {
      let cuesheet = cuesheets.filter(cuesheet => cuesheet._id === _id)[0];

      // Todo: This is hard to read. Can I refactor?
      if (cuesheet) {
        if (cuesheet.cues.length >= 1 && !cuesheet.cues[0].turn ) {
          const requestOptions = this.setHeaders();

          return this.http.get(`${environment.api}/cuesheets/${_id}`, requestOptions)
              .map((response: Response) => new Cuesheet(response.json().cuesheet))
              .toPromise();
        } else {
          return Promise.resolve(cuesheet);
        }
      } else {
        this.router.navigate([ '/cuesheet/demo' ]);
      }
    });
  };

  putCuesheetInStorage(cuesheet) {
    sessionStorage.setItem('rpCuesheet', JSON.stringify(cuesheet));
  }

  // sendCuesheetToIframe(windowRef, cuesheet) {
  //   setTimeout(() => {
  //     windowRef.postMessage(cuesheet, '*');
  //   }, 5000);
  // }

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

  updateCuesheet(updatedCuesheet) {
    let cuesheets = this.cuesheets$.value;
    cuesheets = cuesheets.filter(cuesheet => cuesheet._id !== updatedCuesheet._id);
    cuesheets.unshift(updatedCuesheet);
    this.cuesheets$.next(cuesheets);
  }


}
