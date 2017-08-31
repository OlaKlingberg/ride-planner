import { Component, OnDestroy, OnInit } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { SocketService } from '../core/socket.service';
import { User } from '../user/user';
import { DebuggingService } from './debugging.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './debugger.component.html',
  styleUrls: [ './debugger.component.scss' ]
})
export class DebuggerComponent implements OnInit, OnDestroy {
  private socket: Socket;
  private subscription: Subscription;

  debugMessages: Array<any> = [];
  time: string = '';

  constructor(private debuggingService: DebuggingService,
              private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  ngOnInit() {
    this.watchForDebugMessages();
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

  watchForDebugMessages() {
    this.subscription = this.debuggingService.debugMessages$.subscribe(message => {
      this.debugMessages.push(message);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
