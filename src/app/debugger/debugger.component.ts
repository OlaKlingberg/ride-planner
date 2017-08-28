import { Component, OnDestroy, OnInit } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { SocketService } from '../core/socket.service';
import { User } from '../user/user';

@Component({
  templateUrl: './debugger.component.html',
  styleUrls: [ './debugger.component.scss' ]
})
export class DebuggerComponent implements OnInit, OnDestroy {
  time;

  public debugMessages: Array<any> = [];
  private socket: Socket;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  ngOnInit() {
    this.listenForDebugMessages();
    this.clock();
  }

  clearMessageList() {
    this.debugMessages = [];
  }

  clock() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString('en-US', { hour12: false })
    }, 1000);
  }

  listenForDebugMessages() {
    this.socket.on('debugging', message => {
      this.debugMessages.push(message);
    });
  }

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }
}
