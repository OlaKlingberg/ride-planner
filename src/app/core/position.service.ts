import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class PositionService {
  position$: BehaviorSubject<any> = new BehaviorSubject(null);

  private dummyLatInc: number = Math.random() * .00004 - .00002;
  private dummyLatInitialAdd: number = Math.random() * .002 - .001;

  private dummyLngInc: number = Math.random() * .00004 - .00002;
  private dummyLngInitialAdd: number = Math.random() * .002 - .001;

  private dummyUpdateFrequency: number = Math.random() * 0 + 100;

  private geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 6000,      // Todo: Figure out what value I want here, and what to do on timeout.
    maximumAge: 5000
  };

  constructor() {
    // this.getPosition();
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

  geolocationWatchPosition() {
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

  getPosition() {
    let position = JSON.parse(environment.storage.getItem('position'));

    // Case 1 and 2
    if ( position ) {
      console.log("Case 1 and 2");
      // if ( environment.dummyPosition ) position = this.setDummyPositions(position);
      this.position$.next(position);
    }

    // Case 1
    if ( position && environment.dummyMovement ) {
      console.log("Case 1");
      this.setDummyMovements();
    }

    // Case 2
    if ( position && !environment.dummyMovement ) {
      console.log("Case 2");
      this.geolocationWatchPosition();
    }

    // Case 3
    if ( !position && environment.dummyMovement ) {
      console.log("Case 3");
      navigator.geolocation.getCurrentPosition((position: Position) => {
            let pos = this.copyPositionObject(position);
            if ( environment.dummyPosition ) pos = this.setDummyPositions(pos);
            this.position$.next(pos);
            this.setDummyMovements();
          },
          err => {
            console.log(`watchPosition error: ${err.message}`);
          },
          this.geolocationOptions
      );
    }

    // Case 4
    if ( !position && !environment.dummyMovement ) {
      console.log("Case 4");
      this.geolocationWatchPosition();
    }
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
      pos.coords.latitude += this.dummyLatInc;
      pos.coords.longitude += this.dummyLngInc;
      this.position$.next(pos);
    }, this.dummyUpdateFrequency);

  }

  setDummyPositions(pos) {
    console.log("Dummy Positions");
    pos.coords.latitude += this.dummyLatInitialAdd;
    pos.coords.longitude += this.dummyLngInitialAdd;

    return pos;
  }

}