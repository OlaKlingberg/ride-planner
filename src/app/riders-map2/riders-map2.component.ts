import { Component, OnInit, OnDestroy } from '@angular/core';

import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
// import { LatLngBounds } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import { RiderService } from '../_services/rider.service';

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit, OnDestroy {
  private mapLat: number;
  private mapLng: number;
  private maxZoom: number = 17;
  private riders: Rider[];

  private google: any;
  private bounds: LatLngBounds;
  private latLng: LatLngBoundsLiteral;

  private coordsSub: Subscription;
  private ridersSub: Subscription;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'red', 'yellow' ];

  constructor(private statusService: StatusService,
              private riderService: RiderService,  // Needs to be injected, to be initiated.
              private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.watchCoords();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.bounds = new this.google.maps.LatLngBounds();
      this.watchRiders();
    });
  }

  watchCoords() {
    // Use saved coordinates, if there are any ...
    let coords = this.statusService.coords;
    if ( coords ) {
      console.log("coords which should only be used when navigating the riders map:", coords);
      this.mapLat = coords.lat;
      this.mapLng = coords.lng;
    }

    // ... and then subscribe to updates, but throttle the update rate, so as not to use too man map loads.
    this.coordsSub = this.statusService.coords$
        .throttleTime(60000)
        .subscribe((coords) => {
          console.log("coords$ fired:", coords);
          if ( coords ) {
            console.log("coords updated through the subscription:", coords);
            this.mapLat = coords.lat;
            this.mapLng = coords.lng;
          }
        });
  }

  watchRiders() {
    this.ridersSub = this.statusService.riders$.subscribe(riders => {
      if ( riders && riders.length > 0 ) {
        this.riders = riders;
        this.riders.forEach(rider => this.bounds.extend({ lat: rider.lat, lng: rider.lng }));
        this.latLng = this.bounds.toJSON();
        console.log(this.riders.map(rider => `${rider.fullName}. Lat: ${rider.lat}. Lng: ${rider.lng}`));
      }
    });
  }

  ngOnDestroy() {
    this.coordsSub.unsubscribe();
    this.ridersSub.unsubscribe();
  }


}

