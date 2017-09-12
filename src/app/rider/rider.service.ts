import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../user/user';
import { SocketService } from '../core/socket.service';
import Socket = SocketIOClient.Socket;

@Injectable()
export class RiderService {
  riderList$: BehaviorSubject<Array<User>> = new BehaviorSubject(null);

  private socket: Socket;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
    this.onRiderList();
  }

  emitGiveMeRiderList(user) {
    this.socket.emit('giveMeRiderList', user.ride);
  }

  getAllRiders() {
    return this.riderList$.value;
  }

  onRiderList() {
    this.socket.on('riderList', riderList => {
      riderList = riderList.map(rider => new User(rider));
      this.riderList$.next(riderList);
    });
  }
}
