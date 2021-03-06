import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Cuesheet } from './cuesheet';
import { CuesheetService } from './cuesheet.service';
import { SettingsService } from '../settings/settings.service';


@Injectable()
export class CuesheetDemoService {
  private cuesheetListInStorageFlag$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private cuesheetService: CuesheetService,
              private http: Http,
              private router: Router,
              private settingsService: SettingsService) {
    this.setCuesheetListInStorage();
  }

  createCuesheet(model) {
    model.cues = {};

    model._creator = {
      _id: model._creator,
      fname: 'Jane',
      lname: 'Doe'
    };

    model._id = Math.floor(Math.random() * 1000000).toString();

    let cuesheets = JSON.parse(sessionStorage.getItem('rpCuesheets'));
    cuesheets.push(new Cuesheet(model));
    sessionStorage.setItem('rpCuesheets', JSON.stringify(cuesheets));

    return model;
  }

  cuesheetListInStoragePromise() {
    return new Promise((resolve, reject) => {
      const subscription = this.cuesheetListInStorageFlag$.subscribe(flag => {
        if ( flag ) {
          resolve();
          subscription.unsubscribe();
        }
      })
    });
  }

  deleteCuesheet(id) {
    let cuesheets = JSON.parse(sessionStorage.getItem('rpCuesheets'));
    cuesheets = cuesheets.filter(cuesheet => cuesheet._id !== id);
    sessionStorage.setItem('rpCuesheets', JSON.stringify(cuesheets));
  }

  getCuesheet(_id) {
    return this.cuesheetListInStoragePromise().then(() => {
      let cuesheets = JSON.parse(sessionStorage.getItem('rpCuesheets'));

      let cuesheet = cuesheets.filter(cuesheet => cuesheet._id === _id)[ 0 ];

      if ( cuesheet ) {
        if ( cuesheet.cues.length >= 1 && !cuesheet.cues[ 0 ].turn ) {
          const requestOptions = this.setHeaders();

          return this.http.get(`${this.settingsService.api}/cuesheets/${_id}`, requestOptions)
              .map((response: Response) => new Cuesheet(response.json().cuesheet))
              .do((cuesheet: Cuesheet) => {
                cuesheets = cuesheets.filter(oldCuesheet => oldCuesheet._id !== cuesheet._id);
                cuesheets.unshift(cuesheet);
                sessionStorage.setItem('rpCuesheets', JSON.stringify(cuesheets));
              })
              .toPromise();
        } else {
          return Promise.resolve(cuesheet);
        }
      } else {
        this.router.navigate([ '/cuesheet/demo' ]);
      }
    });
  };

  getCuesheetList(): Promise<Cuesheet[]> {
    return this.cuesheetListInStoragePromise().then(() => {
      return JSON.parse(sessionStorage.getItem('rpCuesheets'));
    });
  }

  setCuesheetListInStorage() {
    let cuesheets = sessionStorage.getItem('rpCuesheets');

    if (cuesheets) {
      this.cuesheetListInStorageFlag$.next(true);
    } else {
      this.cuesheetService.getCuesheetList().toPromise().then(cuesheets => {
        sessionStorage.setItem('rpCuesheets', JSON.stringify(cuesheets));

        this.cuesheetListInStorageFlag$.next(true);
      });
    }
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

  updateCuesheet(updatedCuesheet) {
    let cuesheets = JSON.parse(sessionStorage.getItem('rpCuesheets'));
    cuesheets = cuesheets.filter(cuesheet => cuesheet._id !== updatedCuesheet._id);
    cuesheets.unshift(updatedCuesheet);
    sessionStorage.setItem('rpCuesheets', JSON.stringify(cuesheets));
  }
}
