import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { MapService } from '../_services/map.service';

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
              private mapService: MapService,
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
      this.mapService.emitRider(user);
    });

    return this.router.navigate([ '/riders-map2' ]);
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

}

