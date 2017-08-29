import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RideSubjectService {
  ride$: BehaviorSubject<string> = new BehaviorSubject(null);

  // Todo: Will I be needing this? I do use positionPromise().
  ridePromise() {
    let ridePromise = new Promise((resolve, reject) => {
      let subscription = this.ride$.subscribe(pos => {
        if ( pos ) {
          resolve(pos);
          subscription.unsubscribe();
        }
      })
    });

    return ridePromise;
  }
}