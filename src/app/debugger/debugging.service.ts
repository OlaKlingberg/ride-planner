import { Injectable } from '@angular/core';
import { MiscService } from '../shared/misc.service';
import Socket = SocketIOClient.Socket;
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DebuggingService {
  private socket: Socket;
  public debugMessages$: Subject<any> = new Subject();


  constructor(private miscService: MiscService) {
    this.socket = this.miscService.socket;
    this.watchForDebugMessages();
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

