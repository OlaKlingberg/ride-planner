import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Timer = NodeJS.Timer;
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PositionService {
  public position$: BehaviorSubject<any> = new BehaviorSubject(null);
  public positionPromise: Promise<any>;

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
    this.makePositionPromise();
  }

  makePositionPromise() {
    this.positionPromise = new Promise((resolve, reject) => { // Todo: Do I need to handle reject?
      this.position$.subscribe(position => {
        // console.log("PositionService.makePositionPromise(). About to resolve the promise.");
        if ( position ) resolve(position);
      });
    });
  }

  watchPosition() {
    this.geoWatch = navigator.geolocation.watchPosition(position => {
          if (this.updateTimer) clearInterval(this.updateTimer);

          let pos = this.copyPositionObject(position);

          if (environment.dummyPosition) {
            pos.coords.latitude += this.dummyLatInitialAdd;
            pos.coords.longitude += this.dummyLngInitialAdd;
          }

          if (environment.dummyMovement) {
            let startLat = pos.coords.latitude;
            let startLng = pos.coords.longitude;
            this.updateTimer = setInterval(() => {
              this.dummyLatCurrentAdd += this.dummyLatIncrement;
              this.dummyLngCurrentAdd += this.dummyLngIncrement;
              pos.coords.latitude = startLat + this.dummyLatCurrentAdd;
              pos.coords.longitude = startLng + this.dummyLngCurrentAdd;
              this.position$.next(pos);
            }, this.dummyUpdateFrequency);
          } else {
            this.position$.next(pos);
          }

          // Set a timer to rerun watchPosition if it has not yielded results for a while. Logically, this should not be needed, but it often seems to yield a new position.
          if (this.geoWatchTimer) clearTimeout(this.geoWatchTimer);
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

  // Todo: Can I do this with JSON.stringify() and JSON.parse()?
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