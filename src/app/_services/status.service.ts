import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Rider } from '../_models/rider';
import { User } from '../_models/user';

@Injectable()
export class StatusService {
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);

  constructor() { }

}
