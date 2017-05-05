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
  maxZoom: number = 17;
  riders: Array<Rider> = [];

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private riderSub: Subscription;

  // public focusedOnUser: boolean = true;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'white', 'red', 'brown', 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'yellow' ];

  constructor(private statusService: StatusService,
              private riderService: RiderService,  // Needs to be injected, to be initiated.
              private mapsAPILoader: MapsAPILoader) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      // this.bounds = new this.google.maps.LatLngBounds();
      this.focusOnUser();
      this.watchRiders();
    });
  }

  watchRiders() {
    this.riderSub = this.statusService.riders$
        .subscribe(riders => {
          riders = this.setMarkerColor(riders);
          this.riders = riders;
        });
  }

  setMarkerColor(riders) {
    let user = this.statusService.user$.value;
    riders = riders.map(rider => {
      rider.color = rider.colorNumber + 3;
      rider.zInd = rider.zIndex;

      // Disconnected rider
      if (rider.disconnected) {
        rider.color = 0;
        rider.opacity = .5;
        rider.zInd = 0 - rider.zIndex;
      }

      // The user's own marker
      if (rider._id === user._id) {
        rider.color = 1;
        rider.zInd = 302;
      }

      // Ride leader
      if (user) {
        if (rider.leader === true) {
          rider.color = 2;
          rider.zInd = 301;
        }
      }

      return rider;
    });
    return riders;
  }

  fitAllRiders() {
    // this.focusedOnUser = false;
    this.bounds = new this.google.maps.LatLngBounds();
    this.riders.forEach(rider => {
      if ( rider.lat && rider.lng ) this.bounds.extend({ lat: rider.lat, lng: rider.lng });
    });
    this.latLng = this.bounds.toJSON();
  }

  focusOnUser() {
    // this.focusedOnUser = true;
    this.bounds = new this.google.maps.LatLngBounds();
    let coordsSub: Subscription = this.statusService.coords$.subscribe(coords => {
      console.log("Subscribed to coords$");
      if (coords) {
        console.log("Coords has a value: ", coords);
        this.bounds.extend({lat: coords.lat, lng: coords.lng});
        this.latLng = this.bounds.toJSON();
      }
    });
    setTimeout(() => {  // Todo: This is a highly unsatisfactory workaround.
      coordsSub.unsubscribe();
    }, 5000);
  }

  ngOnDestroy() {
    this.riderSub.unsubscribe();
  }

}

