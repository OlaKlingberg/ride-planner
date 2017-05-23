import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import Socket = SocketIOClient.Socket;

@Injectable()
export class MiscService {
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject('show');
  public socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }

}
