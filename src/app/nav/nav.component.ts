import { Component, OnInit } from '@angular/core';
import { StatusService } from '../_services/status.service';
import { User } from '../_models/user';
import * as $ from 'jquery';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ]
})
export class NavComponent implements OnInit {
  public user: User;
  public ride: string;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchUser();
    this.watchRide();
  }

  watchUser() {
    this.statusService.user$.subscribe(
        user => this.user = user
    );
  }

  watchRide() {
    this.statusService.currentRide$.subscribe(
        ride => this.ride = ride
    );
  }

  collapseNav() {
    if ($(window).width() < 768) $('.navbar-toggle').click();
  }

}
