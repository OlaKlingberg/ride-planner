import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class PositionService {
  position$: BehaviorSubject<any> = new BehaviorSubject(null);

  private geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 20000,      // Todo: Figure out what value I want here, and what to do on timeout.
    maximumAge: 5000
  };

  private alreadyRunFlag: boolean;

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
    if ( this.alreadyRunFlag ) return;

    let position = JSON.parse(environment.storage.getItem('rpPosition'));
    environment.storage.removeItem('rpPosition');

    // Case 1
    if ( position && environment.dummyMovement ) {
      this.position$.next(position);
      this.setDummyMovements();
    }

    // Case 2
    if ( position && !environment.dummyMovement ) {
      this.position$.next(position);
    }

    // Case 3
    if ( !position && environment.dummyMovement ) {
      // Todo: Clear the getCurrentPosition and watchPosition somewhere.
      navigator.geolocation.getCurrentPosition((position: Position) => {
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
    if ( !position && !environment.dummyMovement ) {
      navigator.geolocation.watchPosition((position: Position) => {
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

    this.alreadyRunFlag = true;
  }

  positionPromise() {
    let positionPromise = new Promise((resolve, reject) => {
      let subscription = this.position$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });

    return positionPromise;
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
    console.log("Dummy Positions");
    pos.coords.latitude += environment.dummyLatInitialAdd;
    pos.coords.longitude += environment.dummyLngInitialAdd;

    return pos;
  }

}