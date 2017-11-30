import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PositionService {
  position$: BehaviorSubject<any> = new BehaviorSubject(null);

  private geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 20000,      // Todo: Figure out what value I want here, and what to do on timeout.
    maximumAge: 30000
  };
  private positionWatcher: any;

  constructor(private settingsService: SettingsService) {
  }

  // Todo: Why can't I do this with JSON.parse(JSON.stringify())? Why can't you stringify a Position object?
  copyPositionObject(position) {
    return {
      coords: {
        accuracy: position.coords.accuracy,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      timestamp: position.timestamp
    };
  }

  getPosition() {
    if (this.position$.value) return this.position$.value;

    let rpPosition = JSON.parse(eval(this.settingsService.storage).getItem('rpPosition'));
    eval(this.settingsService.storage).removeItem('rpPosition');

    // Case 1
    if ( rpPosition && this.settingsService.dummyMov ) {
      this.position$.next(rpPosition);
      this.setDummyMovs();
    }

    // Case 2
    if ( rpPosition && !this.settingsService.dummyMov ) {
      this.position$.next(rpPosition);
    }

    // Case 3
    if ( !rpPosition && this.settingsService.dummyMov ) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
            let pos = this.copyPositionObject(position);
            if ( this.settingsService.dummyPos ) pos = this.setDummyPos(pos);
            this.position$.next(pos);
            this.setDummyMovs();
          },
          err => {
            console.log(`getCurrentPosition error: ${err.message}`);
          },
          this.geolocationOptions
      );
    }

    // Case 4
    if ( !rpPosition && !this.settingsService.dummyMov ) {
      if (this.positionWatcher) navigator.geolocation.clearWatch(this.positionWatcher);
      this.positionWatcher = navigator.geolocation.watchPosition((position: Position) => {
            let pos = this.copyPositionObject(position);
            if ( this.settingsService.dummyPos ) pos = this.setDummyPos(pos);
            this.position$.next(pos);
          },
          err => {
            console.log(`watchPosition error: ${err.message}`);
          },
          this.geolocationOptions
      );
    }
  }

  positionPromise() {
    return new Promise((resolve, reject) => {
      let subscription = this.position$.subscribe((pos: Position) => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });
  }

  setDummyMovs() {
    let dummyMovIncLat = this.settingsService.dummyMovIncLat;
    let dummyMovIncLng = this.settingsService.dummyMovIncLng;

    setInterval(() => {
      let pos = this.position$.value;
      pos.coords.latitude += dummyMovIncLat;
      pos.coords.longitude += dummyMovIncLng;
      this.position$.next(pos);
    }, this.settingsService.dummyUpdateFreq * 1000);

  }

  setDummyPos(pos) {
    pos.coords.longitude += this.settingsService.dummyPosAddLat;
    pos.coords.longitude += this.settingsService.dummyPosAddLng;

    return pos;
  }

}