import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { RiderService } from '../_services/rider.service';
import { Rider } from '../_models/rider';
import { StatusService } from '../_services/status.service';

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  private lat: number;
  private lng: number;
  private zoom: number = 15;
  private riders: Rider[];

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'red', 'yellow' ];

  constructor(private riderService: RiderService,
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchCoords();
    this.listenForRiders();
  }

  watchCoords() {
    this.riderService.coords$.subscribe((coords) => {
      if ( coords ) {
        this.lat = coords.latitude;
        this.lng = coords.longitude;
      }
    });
  }

  listenForRiders() {
    console.log("RidersMap2Component.listenForRiders()");
    this.statusService.riders$.subscribe((riders) => {
      console.log("RidersMap2Component.listenForRiders() riders", riders);
      if ( riders && riders.length > 0 ) {
        this.riders = riders.map(rider => new Rider(rider));
        this.riders.forEach(rider => {
          rider.color = ( rider.initials.charCodeAt(0) + rider.initials.charCodeAt(1) ) % 8;
        });

      }
    });
  }


}

