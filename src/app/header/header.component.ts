import { Component, OnInit } from '@angular/core';
import { StatusService } from '../_services/status.service';
import { User } from '../_models/user';
import * as $ from 'jquery';

@Component({
  selector: 'rp-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
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
    // $(".navbar-collapse").collapse('collapse');
    $('.navbar-toggle').click() //bootstrap 3.x by Richard

  }

}
