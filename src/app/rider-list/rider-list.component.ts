import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from '../_services/misc.service';
import { Rider } from '../_models/rider';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import { RiderService } from '../_services/rider.service';

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

  constructor(private miscService: MiscService,
              private riderService: RiderService,
              private router: Router) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.watchCurrentRide();
    this.watchRiders()
  }

  watchCurrentRide() {
    this.currentRideSub = this.riderService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    })
  }

  watchRiders() {
    this.ridersSub = this.riderService.riders$.subscribe(riders => {
      this.riders = riders;
    });
  }

  goToRideSelector() {
    this.router.navigate([ '/ride-selector' ]);
  }

  clearServerOfRiders() {
    this.socket.emit('clearServerOfRiders', this.riderService.currentRide$.value);
  }

  ngOnDestroy() {
    this.currentRideSub.unsubscribe();
    this.ridersSub.unsubscribe();
  }

}
