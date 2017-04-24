import { Component, OnInit } from '@angular/core';

import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
// import { LatLngBounds } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  private mapLat: number;
  private mapLng: number;
  // private riderLat: number;
  // private riderLng: number;
  private maxZoom: number = 17;
  private riders: Rider[];

  private google: any;
  private bounds: LatLngBounds;
  private latLng: LatLngBoundsLiteral;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'red', 'yellow' ];

  constructor(private statusService: StatusService,
              private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.watchCoords();
    this.watchRiders();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.fitBounds();
    });
  }

  watchCoords() {


    this.statusService.coords$
        .throttleTime(10000)    // Save map loads by only updating the map so often.
        .do(() => {console.log("coords$ fired!")})
        .subscribe((coords) => {
          if ( coords ) {
            console.log("coords:", coords);
            this.mapLat = coords.lat;
            this.mapLng = coords.lng;
          }
        });
  }

  watchRiders() {
    this.statusService.riders$.subscribe(riders => {
      if ( riders && riders.length > 0 ) {
        this.riders = riders;
        console.log(this.riders.map(rider => `${rider.fullName}. Lat: ${rider.lat}.`));
      }
    });
  }

  fitBounds() {
    this.bounds = new this.google.maps.LatLngBounds();

    this.statusService.riders$.subscribe(riders => {
      if ( riders ) {
        riders.forEach(rider => this.bounds.extend({ lat: rider.lat, lng: rider.lng }));
        this.latLng = this.bounds.toJSON();
      }
    });
  }


}

