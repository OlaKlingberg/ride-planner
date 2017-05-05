import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";
import { StatusService } from '../_services/status.service';
import { User } from '../_models/user';

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
    this.statusService.user$.subscribe(
        user => this.user = user
    );

    this.statusService.currentRide$.subscribe(
        ride => this.ride = ride
    );
  }

}
