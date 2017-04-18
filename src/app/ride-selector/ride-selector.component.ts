import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../_services/socket.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit {
  private availableRides: Array<string> = [];
  private ride: string;
  private

  public model: any = [];

  constructor(private router: Router,
              private socketService: SocketService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.getCurrentRides()
  }

  getCurrentRides() {
    // Simulate latency.
    setTimeout(() => {
      this.availableRides.push('Rockland Lakes');
    }, 500);
  }

  onSubmit() {
    this.authenticationService.user$.subscribe((user) => {
      this.socketService.emitRider(user);
    });


    this.router.navigate([ '/riders-map2' ]);
  }

}
