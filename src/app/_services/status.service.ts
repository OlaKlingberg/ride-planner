import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Rider } from '../_models/rider';

@Injectable()
export class StatusService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);

  constructor() { }

}
