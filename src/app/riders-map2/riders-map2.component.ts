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
  mapLat: number;
  mapLng: number;
  maxZoom: number = 17;
  riders: Rider[];

  private google: any;
  private bounds: LatLngBounds;
  latLng: LatLngBoundsLiteral;

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
      this.watchRiders();
    });
  }

  watchCoords() {
    this.coordsSub = this.statusService.coords$
        .subscribe((coords) => {
          if ( coords ) {
            this.mapLat = coords.lat;
            this.mapLng = coords.lng;
          }
        });
  }

  watchRiders() {
    this.ridersSub = this.statusService.riders$.subscribe(riders => {
      if ( riders && riders.length > 0 ) {
        this.bounds = new this.google.maps.LatLngBounds();
        this.riders = riders;
        this.riders.forEach(rider => this.bounds.extend({ lat: rider.lat, lng: rider.lng }));
        this.latLng = this.bounds.toJSON();
        console.log(this.riders.forEach(rider => `${rider.fullName}. Lat: ${rider.lat}. Lng: ${rider.lng}`));
      }
    });

    // this.statusService.riders$.take(10).subscribe(riders => {
    //   if ( riders && riders.length > 0 ) {
    //     this.bounds = new this.google.maps.LatLngBounds();
    //     this.riders = riders;
    //     this.riders.forEach(rider => this.bounds.extend({ lat: rider.lat, lng: rider.lng }));
    //     this.latLng = this.bounds.toJSON();
    //     console.log(this.riders.forEach(rider => `${rider.fullName}. Lat: ${rider.lat}. Lng: ${rider.lng}`));
    //   }
    // });

    setInterval(() => {
      this.riders[0].lat += .001;
    }, 2000)


  }

  ngOnDestroy() {
    this.coordsSub.unsubscribe();
    this.ridersSub.unsubscribe();
  }

}

