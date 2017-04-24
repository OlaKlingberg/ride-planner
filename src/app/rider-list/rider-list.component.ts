import { Component, OnInit } from '@angular/core';
import { nameSort } from '../_lib/util';
import { Router } from '@angular/router';
import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  private riders: Rider[];
  private currentRide: string;

  constructor(private statusService: StatusService,
              private router: Router) {
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
      console.log(riders);
    });
  }

  goToRideSelector() {
    this.router.navigate([ '/ride-selector' ])
  }

}
