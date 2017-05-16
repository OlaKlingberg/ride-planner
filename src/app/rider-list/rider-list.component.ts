import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  riders: Rider[];
  currentRide: string;
  private socket: Socket;
  private currentRideSub: Subscription;
  private ridersSub: Subscription;

  constructor(private statusService: StatusService,
              private router: Router) {
    this.socket = this.statusService.socket;
  }

  ngOnInit() {
    this.watchCurrentRide();
    this.watchRiders();
  }

  watchCurrentRide() {
    this.currentRideSub = this.statusService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  }

  watchRiders() {
    this.ridersSub = this.statusService.riders$.subscribe(riders => {
      this.riders = riders;
    });
  }

  goToRideSelector() {
    this.router.navigate([ '/ride-selector' ])
  }

  clearServerOfRiders() {
    this.socket.emit('clearServerOfRiders', this.statusService.currentRide$.value);
  }

  ngOnDestroy() {
    this.currentRideSub.unsubscribe();
    this.ridersSub.unsubscribe();
  }

}
