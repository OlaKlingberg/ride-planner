import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Rider } from '../_models/rider';
import { User } from '../_models/user';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class StatusService {
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public coords$: Subject<any> = new Subject();
  public coords: {lat: number, lng: number} = null;
  public riders$: BehaviorSubject<Rider[]> = new BehaviorSubject(null);

  constructor() {
    this.coords$.subscribe(coords => this.coords = coords);
  }

}
