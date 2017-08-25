import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Socket = SocketIOClient.Socket;

@Injectable()
export class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }
}
