import { Injectable } from '@angular/core';
import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';

@Injectable()
export class SocketService {
  private socket: Socket;

  public riders$: BehaviorSubject<User[]>;

  constructor() {
    this.riders$ = new BehaviorSubject([]);
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.listenForUpdateRiders();
  }

  emitRider(user) {
    this.socket.emit('newRider', user, () => {
      console.log('Rider emitted');
    });
  }

  listenForUpdateRiders() {
    this.socket.on('updateRiders', (riders) => {
      this.riders$.next(riders);
    })
  }

}
