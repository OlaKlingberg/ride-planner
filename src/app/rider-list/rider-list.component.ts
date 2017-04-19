import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { MapService } from '../_services/map.service';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  private riders: Array<object>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {

    console.log(this.userService.getAllRiders());

    this.userService.getAllRiders()
        .subscribe(response => {
          console.log("response", response);
          console.log("response.json()", response.json());
          this.riders = response.json();
        });

  }

}
