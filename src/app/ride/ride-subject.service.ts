import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RideSubjectService {
  ride$: BehaviorSubject<string> = new BehaviorSubject(null);

  ridePromise() {
    let ridePromise = new Promise((resolve, reject) => {
      let subscription = this.ride$.subscribe(pos => {
        if ( pos ) {
          console.log("About to resolve ridePromise!");
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });

    return ridePromise;
  }
}