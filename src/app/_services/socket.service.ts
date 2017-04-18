import { Injectable } from '@angular/core';
import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class SocketService {
  private socket: Socket;
  public riders$: BehaviorSubject<User[]> = new BehaviorSubject(null);
  user$;

  constructor(private authenticationService: AuthenticationService) {
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.listenForNewRiderList();
  }

  emitRider(user) {
    this.socket.emit('newRider', user, () => {
      console.log('Rider emitted', user);
    });
  }

  listenForNewRiderList() {
    this.socket.on('newRiderList', (riders) => {
      console.log("SocketService.listenForNewRiderList", riders);
      this.riders$.next(riders);
    })
  }

  removeRider() {
    console.log("removeRider");
    console.log(this);
    this.user$ = this.authenticationService.user$.subscribe((user) => {
      if (user) {
        this.socket.emit('removeRider', user, () => {
          console.log("Rider removed!");
        });
      }
    });
    this.user$.unsubscribe();
  }



}
