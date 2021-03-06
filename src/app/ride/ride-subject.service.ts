import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Ride } from './ride';

@Injectable()
export class RideSubjectService {
  availableRides$: BehaviorSubject<Ride[]> = new BehaviorSubject(null);
  ride$: BehaviorSubject<string> = new BehaviorSubject(null);
}