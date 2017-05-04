import { Component, OnInit, OnDestroy } from '@angular/core';

import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
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
  riders: Array<Rider> = [];
  testArray: Array<any> = [];

  private google: any;
  private bounds: LatLngBounds;
  latLng: LatLngBoundsLiteral;

  private coordsSub: Subscription;
  private riderSub: Subscription;

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
    console.log(".............. typeof this.riders:", typeof this.riders);
    console.log("typeof this.testArray:", typeof this.testArray);
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
    this.riderSub = this.statusService.riders$
        .subscribe(riders => {
          this.riders = riders;
          this.setMapBounds();
        });


  }

  setMapBounds() {
    this.riders.forEach(rider => {
      if ( rider.lat && rider.lng ) this.bounds.extend({ lat: rider.lat, lng: rider.lng });
    });
    this.latLng = this.bounds.toJSON();
  }


  ngOnDestroy() {
    this.coordsSub.unsubscribe();
    this.riderSub.unsubscribe();
  }

}

