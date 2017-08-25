import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RideSubjectService {
  public ride$: BehaviorSubject<string> = new BehaviorSubject(null);
  public ridePromise: Promise<any>;
  private rideSub: Subscription;

  constructor() {}

  getRidePromise() {
    if ( this.rideSub ) this.rideSub.unsubscribe();

    this.ridePromise = new Promise((resolve, reject) => {
      this.rideSub = this.ride$.subscribe(ride => {
        if ( ride ) resolve(ride);
      })
    });

    return this.ridePromise;
  }
}