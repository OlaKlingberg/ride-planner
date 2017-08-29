import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';

@Injectable()
export class PositionService {
  position$: BehaviorSubject<any> = new BehaviorSubject(null);

  private dummyLatInc: number = Math.random() * .00004 - .00002;
  private dummyLatInitialAdd: number = Math.random() * .001 - .0005;

  private dummyLngInc: number = Math.random() * .00004 - .00002;
  private dummyLngInitialAdd: number = Math.random() * .001 - .0005;

  private dummyUpdateFrequency: number = Math.random() * 0 + 100;

  private geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 6000,      // Todo: Figure out what value I want here, and what to do on timeout.
    maximumAge: 5000
  };

  constructor() {
    this.getPosition();
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

  geolocationGetCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, this.geolocationOptions);
    });
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

    if ( position ) {
      if ( environment.dummyPosition ) position = this.setDummyPositions(position);
      this.position$.next(position);
    }

    if ( position && environment.dummyMovement ) {
      this.setDummyMovements();
    }

    if ( position && !environment.dummyMovement ) {
      this.geolocationWatchPosition();
    }

    if ( !position && environment.dummyMovement ) {
      // Todo: Call geolocation.getCurrentPosition here directly, instead of putting it in a separate function.
      this.geolocationGetCurrentPosition().then(position => {
        let pos = this.copyPositionObject(position);
        if ( environment.dummyPosition ) pos = this.setDummyPositions(pos);
        this.position$.next(pos);
        this.setDummyMovements();
      })
    }

    if ( !position && !environment.dummyMovement ) {
      this.geolocationWatchPosition();
    }

    // if ( position ) {
    //   if ( environment.dummyPosition ) position = this.setDummyPositions(position);
    //   this.position$.next(position);
    //   if ( environment.dummyMovement ) {
    //     this.setDummyMovements();
    //   } else {
    //     this.geolocationWatchPosition();
    //   }
    // } else {
    //   if ( environment.dummyMovement ) {
    //     this.geolocationGetCurrentPosition().then(position => {
    //       let pos = this.copyPositionObject(position);
    //       if ( environment.dummyPosition ) pos = this.setDummyPositions(pos);
    //       this.position$.next(pos);
    //       this.setDummyMovements();
    //     });
    //   } else {
    //     this.geolocationWatchPosition();
    //   }
    // }
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
    pos.coords.latitude += this.dummyLatInitialAdd;
    pos.coords.longitude += this.dummyLngInitialAdd;

    return pos;
  }

}