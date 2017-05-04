import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import Socket = SocketIOClient.Socket;

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  riders: Rider[];
  currentRide: string;
  private socket: Socket;

  constructor(private statusService: StatusService,
              private router: Router) {
    this.socket = this.statusService.socket;
  }

  ngOnInit() {
    this.watchCurrentRide();
    this.watchRiders();
  }

  watchCurrentRide() {
    this.statusService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  }

  watchRiders() {
    this.statusService.riders$.subscribe(riders => {
      this.riders = riders;
    });
  }

  goToRideSelector() {
    this.router.navigate([ '/ride-selector' ])
  }

  clearServerOfRiders() {
    this.socket.emit('clearServerOfRiders', this.statusService.currentRide$.value);
  }

}
