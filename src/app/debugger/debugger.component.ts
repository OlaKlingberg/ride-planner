import { Component, OnInit } from '@angular/core';
import { StatusService } from '../_services/status.service';
import Socket = SocketIOClient.Socket;
import { User } from '../_models/user';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: [ './debugger.component.scss' ]
})
export class DebuggerComponent implements OnInit {
  private user: User;
  private socket: Socket;
  public debugMessages: Array<any> = [];

  constructor(private statusService: StatusService) {
    this.socket = statusService.socket;
  }

  ngOnInit() {
    this.listenForDebugMessages();
  }

  listenForDebugMessages() {
    this.socket.on('debugging', message => {
      console.log("This is the message I got from debugger:", message);
      if (message.substr(0, 3) === 'Ada') {
        console.log("Now I will push that message to the array to be displayed.");
        this.debugMessages.push(message);
      }
    });
  }

  clearMessageList() {
    this.debugMessages = [];
  }

}
