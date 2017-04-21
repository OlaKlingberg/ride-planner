import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { nameSort } from '../_lib/util';
import { RiderService } from '../_services/rider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  private riders: Array<object>;
  private selectedRide: string;

  constructor(private riderService: RiderService,
              private router: Router) {
  }

  ngOnInit() {
    this.selectedRide = localStorage.getItem('selectedRide');

    this.riderService.getAllRiders()
        .subscribe(response => {
          this.riders = response.json();
          this.riders.sort(nameSort);
        });
  }

  goToRideSelector() {
    this.router.navigate([ '/ride-selector' ])
  }

}
