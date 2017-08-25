import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Timer = NodeJS.Timer;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PositionService {
  public position$: BehaviorSubject<any> = new BehaviorSubject(null);

  private geoWatch: number;
  private geoWatchTimer: Timer;
  private updateTimer: Timer;

  private dummyLatInitialAdd: number = Math.random() * .001 - .0005;
  private dummyLngInitialAdd: number = Math.random() * .001 - .0005;
  private dummyUpdateFrequency: number = Math.random() * 2000 + 1000;
  private dummyLatIncrement: number = Math.random() * .0002 - .0001;
  private dummyLngIncrement: number = Math.random() * .0002 - .0001;
  private dummyLatCurrentAdd: number = null;
  private dummyLngCurrentAdd: number = null;

  constructor() {
    this.watchPosition();
  }

  positionPromise() {
    let positionPromise = new Promise((resolve, reject) => {
      let positionSub = this.position$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          positionSub.unsubscribe();
        }
      })
    });

    return positionPromise;
  }

  watchPosition() {
    this.geoWatch = navigator.geolocation.watchPosition((position: Position) => {
          if ( this.updateTimer ) clearInterval(this.updateTimer);

          let pos = this.copyPositionObject(position);

          if ( environment.dummyPosition ) {
            pos = this.setDummyPositions(pos);
          }

          if ( environment.dummyMovement ) {
            this.setDummyMovements(pos);
          } else {
            this.position$.next(pos);
          }

          // Set a timer to rerun watchPosition if it has not yielded results for a while. Logically, this should not be needed, but it often seems to yield a new position.
          if ( this.geoWatchTimer ) clearTimeout(this.geoWatchTimer);
          this.startGeoWatchTimer(position);
        },
        err => {
          console.log(`watchPosition error: ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,      // Todo: Figure out what value I want here, and what to do on timeout.
          maximumAge: 5000
        }
    );
  }

  setDummyPositions(pos) {
    pos.coords.latitude += this.dummyLatInitialAdd;
    pos.coords.longitude += this.dummyLngInitialAdd;

    return pos;
  }

  setDummyMovements(pos) {
    let startLat = pos.coords.latitude;
    let startLng = pos.coords.longitude;
    this.updateTimer = setInterval(() => {
      this.dummyLatCurrentAdd += this.dummyLatIncrement;
      this.dummyLngCurrentAdd += this.dummyLngIncrement;
      pos.coords.latitude = startLat + this.dummyLatCurrentAdd;
      pos.coords.longitude = startLng + this.dummyLngCurrentAdd;
      this.position$.next(pos);
    }, this.dummyUpdateFrequency);
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

  startGeoWatchTimer(position) {
    this.geoWatchTimer = setTimeout(() => {
      navigator.geolocation.clearWatch(this.geoWatch);
      this.watchPosition();
      this.startGeoWatchTimer(position);
    }, 20000);
  }

}