import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
// import { SebmGoogleMap } from "angular2-google-maps/core";
import { Observable } from "rxjs";
import { User } from "../_models/user";
import { MapService } from '../_services/map.service';
import { Rider } from '../_models/rider';

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

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.watchCoords();
    this.listenForRiders();
  }

  watchCoords() {
    this.mapService.coords$.subscribe((coords) => {
      if ( coords ) {
        this.lat = coords.latitude;
        this.lng = coords.longitude;
      }
    });
  }

  listenForRiders() {
    this.mapService.riders$.subscribe((riders) => {
      if ( riders && riders.length > 0 ) {
        this.riders = riders.map(rider => new Rider(rider));
      }
    });
  }

}
