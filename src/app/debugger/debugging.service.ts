import { Injectable } from '@angular/core';

import Socket = SocketIOClient.Socket;
import { Subject } from 'rxjs/Subject';

import { SocketService } from '../core/socket.service';

@Injectable()
export class DebuggingService {
  debugMessages$: Subject<any> = new Subject();
  private socket: Socket;

  constructor(private socketService: SocketService) {
    this.socket = this.socketService.socket;
    this.onDebugMessages();
    this.watchForDebugMessages();
  }

  onDebugMessages() {
      this.socket.on('debugging', message => {
        this.debugMessages$.next(message);
      });
  }

  watchForDebugMessages() {
    this.debugMessages$.subscribe(debugInfo => {
      if (debugInfo.message) {
        this.socket.emit('debugging', debugInfo.message);
      } else {
        this.socket.emit('debugging', debugInfo);}
    });
  }
}

