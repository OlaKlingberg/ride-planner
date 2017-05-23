import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Rider } from '../_models/rider';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import Socket = SocketIOClient.Socket;
import { Subject } from 'rxjs/Subject';

@Injectable()
export class StatusService {
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  public userRider$: BehaviorSubject<Rider> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Array<Rider>> = new BehaviorSubject([]);
  public newRider$: Subject<Rider> = new Subject();
  public updatedRider$: Subject<Rider> = new Subject();
  public removedRider$: Subject<Rider> = new Subject();
  public disconnectedRider$: Subject<Rider> = new Subject();
  public debugMessages$: Subject<any> = new Subject();
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject('show');
  public socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.

    // Set userRider, based on user, currentRide, and coords.
    this.user$
        .combineLatest(this.currentRide$, this.coords$)
        .subscribe(([ user, ride, coords ]) => {
          if ( user && ride && coords ) {
            let userRider = new Rider(user, coords, ride);
            this.userRider$.next(userRider);
          } else {
            this.userRider$.next(null);
          }
        });
  }

}
