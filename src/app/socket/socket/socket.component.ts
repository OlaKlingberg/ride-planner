import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ride-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.scss']
})
export class SocketComponent {

  price: number = 0.0;
  socket = null;
  bidValue = '';

  constructor(){
    this.socket = io('http://localhost:3051');
    this.socket.on('priceUpdate', function(data){
      this.price = data;
    }.bind(this));
  }

  bid(){
    this.socket.emit('bid', this.bidValue);
    this.bidValue = '';
  }

}
