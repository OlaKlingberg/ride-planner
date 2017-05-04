import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Rider } from '../_models/rider';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import Socket = SocketIOClient.Socket;

@Injectable()
export class StatusService {
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);
  public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  public coords$: BehaviorSubject<any> = new BehaviorSubject(null);
  public riders$: BehaviorSubject<Array<Rider>> = new BehaviorSubject([]);
  public socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }

}
