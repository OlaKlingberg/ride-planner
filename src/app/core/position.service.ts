import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class PositionService {
  position$: BehaviorSubject<any> = new BehaviorSubject(null);

  // private alreadyRunFlag: boolean = false;
  private geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 20000,      // Todo: Figure out what value I want here, and what to do on timeout.
    maximumAge: 30000
  };
  private positionWatcher: any;

  constructor() {
  }

  // Todo: Why can't I do this with JSON.stringify() and JSON.parse()?
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
    console.log("position$.value:", this.position$.value);
    if (this.position$.value) return this.position$.value;

    // if ( this.alreadyRunFlag ) return;

    let rpPosition = JSON.parse(environment.storage.getItem('rpPosition'));
    environment.storage.removeItem('rpPosition');

    // Case 1
    if ( rpPosition && environment.dummyMovement ) {
      console.log("getPosition(). Case 1. rpPosition:", rpPosition);//
      this.position$.next(rpPosition);
      this.setDummyMovements();
    }

    // Case 2
    if ( rpPosition && !environment.dummyMovement ) {
      console.log("getPosition(). Case 2. rpPosition:", rpPosition);
      this.position$.next(rpPosition);
    }

    // Case 3
    if ( !rpPosition && environment.dummyMovement ) {
      console.log("getPosition(). Case 3");
      navigator.geolocation.getCurrentPosition((position: Position) => {
        console.log("Case 3. position:", position);
            let pos = this.copyPositionObject(position);
            if ( environment.dummyPosition ) pos = this.setDummyPositions(pos);
            this.position$.next(pos);
            this.setDummyMovements();
          },
          err => {
            console.log(`getCurrentPosition error: ${err.message}`);
          },
          this.geolocationOptions
      );
    }

    // Case 4
    if ( !rpPosition && !environment.dummyMovement ) {
      console.log("getPosition(). Case 4");
      if (this.positionWatcher) navigator.geolocation.clearWatch(this.positionWatcher);
      this.positionWatcher = navigator.geolocation.watchPosition((position: Position) => {
        console.log("Case 4. position:", position);
            let pos = this.copyPositionObject(position);
            if ( environment.dummyPosition ) pos = this.setDummyPositions(pos);
            this.position$.next(pos);
          },
          err => {
            console.log(`watchPosition error: ${err.message}`);
          },
          this.geolocationOptions
      );
    }

    // this.alreadyRunFlag = true;
  }

  positionPromise() {
    return new Promise((resolve, reject) => {
      let subscription = this.position$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });
  }

  setDummyMovements() {
    setInterval(() => {
      let pos = this.position$.value;
      pos.coords.latitude += environment.dummyLatInc;
      pos.coords.longitude += environment.dummyLngInc;
      this.position$.next(pos);
    }, environment.dummyUpdateFrequency);

  }

  setDummyPositions(pos) {
    pos.coords.latitude += environment.dummyLatInitialAdd;
    pos.coords.longitude += environment.dummyLngInitialAdd;

    return pos;
  }

}