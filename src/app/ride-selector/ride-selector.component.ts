import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../_services/socket.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-ride-selector',
  templateUrl: './ride-selector.component.html',
  styleUrls: [ './ride-selector.component.scss' ]
})
export class RideSelectorComponent implements OnInit, OnDestroy {
  private availableRides: Array<string> = [];
  private ride: string;
  private user$;

  public model: any = [];

  constructor(private router: Router,
              private socketService: SocketService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.getCurrentRides();
  }

  getCurrentRides() {
    // Simulate latency.
    setTimeout(() => {
      this.availableRides.push('Rockland Lakes');
    }, 500);
  }

  onSubmit() {
    this.user$ = this.authenticationService.user$.subscribe((user) => {
      console.log("RideSelectorComponent.onSubmit()", user);
      console.log(typeof this.user$);
      this.socketService.emitRider(user);
    });


    this.router.navigate([ '/riders-map2' ]);
  }

  ngOnDestroy() {
    console.log(typeof this.user$);
    this.user$.unsubscribe();
  }

}

