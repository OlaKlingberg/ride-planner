import { Component, OnInit, OnDestroy } from '@angular/core';

import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import { RiderService } from '../_services/rider.service';
import Socket = SocketIOClient.Socket;
import { User } from '../_models/user';

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit, OnDestroy {
  private fullName: string = '';
  public maxZoom: number = 18;
  public riders: Array<Rider> = [];

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private riderSub: Subscription;

  // public focusedOnUser: boolean = true;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'white', 'red', 'brown', 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'yellow' ];

  private socket: Socket;
  public debugMessages: Array<string> = [];

  coordsSub: Subscription;

  constructor(private statusService: StatusService,
              private mapsAPILoader: MapsAPILoader) {
    this.socket = this.statusService.socket;
  }

  ngOnInit() {
    this.watchUser();
    this.sendSocketDebugMessage("Initializing RidersMap2Component!");
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.sendSocketDebugMessage("mapsAPILoader loaded!");
      this.focusOnUser();
      this.watchRiders();
    });
  }

  watchUser() {
    this.statusService.user$.subscribe(user => {
      this.fullName = user ? user.fullName : null;
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
      if ( rider.disconnected ) {
        rider.color = 0;
        rider.opacity = .5;
        rider.zInd = 0 - rider.zIndex;
      }

      // The user's own marker
      if ( rider._id === user._id ) {
        rider.color = 1;
        rider.zInd = 302;
      }

      // Ride leader
      if ( user ) {
        if ( rider.leader === true ) {
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
    this.coordsSub = this.statusService.coords$.subscribe(coords => {
          if ( coords ) {
            this.bounds.extend({ lat: coords.lat, lng: coords.lng });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("RidersMap2Component.focusOnUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
    setTimeout(() => {  // Todo: This is a highly unsatisfactory workaround.
      this.coordsSub.unsubscribe();
    }, 15000);
  }

  ngOnDestroy() {
    this.riderSub.unsubscribe();
    this.coordsSub.unsubscribe();
  }

  sendSocketDebugMessage(message) {
    this.statusService.debugMessages$.next(`${this.fullName}. ${message}`);
  };


}

