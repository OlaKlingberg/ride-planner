import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";
import { StatusService } from '../_services/status.service';

@Component({
  selector: 'rp-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  public user: object;
  public ride: string;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
    this.statusService.user$.subscribe(
        user => this.user = user
    );

    this.statusService.currentRide$.subscribe(
        ride => this.ride = ride
    );
  }

}
