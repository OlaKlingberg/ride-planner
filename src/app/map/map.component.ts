import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import Socket = SocketIOClient.Socket;
import * as _ from 'lodash';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { UserService } from '../_services/user.service';
import { RiderService } from '../_services/rider.service';
import { MiscService } from '../_services/misc.service';

@Component({
  selector: 'rp-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit, OnDestroy {
  public production = environment.production;
  private fullName: string = '';
  public maxZoom: number = 18;
  public riders: Array<Rider> = [];
  // public riders: Object = {};
  // public riders: any = {};

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private riderSub: Subscription;
  private userSub: Subscription;
  private coordsSub: Subscription;
  private navBarStateSub: Subscription;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'white', 'red', 'brown', 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'yellow' ];

  private socket: Socket;
  public debugMessages: Array<string> = [];

  private timer: Array<any> = [];
  private timer2: any;
  public navBarStateTimer: any;

  public minutes: Array<number> = [];

  public mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'showAllRiders';


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  constructor(private riderService: RiderService,
              private userService: UserService,
              private miscService: MiscService,
              private mapsAPILoader: MapsAPILoader) {
    this.socket = this.miscService.socket;

  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();
      this.getRiders();
      this.listenForNewRider();
      this.listenForUpdateRiderPosition();
      this.listenForDisconnectedRider();
      this.listenForRemoveRider();
      this.removeLongDisconnectedRiders();
    });
  }

  // When the nav bar becomes shown, set a timer to hide it again -- but only if the accordion is closed.
  subscribeToNavBarState() {
    this.miscService.navBarState$.subscribe(navBarState => {
      // console.log("Independent subscription of navBarState:", navBarState);
    });

    this.navBarStateSub = this.miscService.navBarState$
        .combineLatest(this.riderService.coords$)
        .subscribe(([ navBarState, coords ]) => {
          // Start the timer to hide the nav bar only when the map is shown, which happens when there are coords.
          if ( coords ) {
            setTimeout(() => { // Have to wait one tick before checking the value of the aria-expanded attribute.
              let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
              if ( navBarState === 'show' && !ariaExpanded ) {
                this.navBarStateTimer = setTimeout(() => {
                  this.miscService.navBarState$.next('hide');
                }, 150);
              }
            }, 0);
          }


        });
  }

  closeInfoWindows(riderId) {
    // This actually works. Apparently, this executes, closing any open infoWindow, before a new one is opened.
    this.infoWindows.forEach(infoWindow => infoWindow.close());

    // If the above hadn't worked, this is how I would have done it.
    // this.infoWindows.forEach(infoWindow => {
    //   if (infoWindow._el.nativeElement.attributes['data-index'] !== riderId) infoWindow.close();
    // });
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.fullName = user ? user.fullName : null;
    });
  }

  getRiders() {
    this.riders = this.riderService.riders$.value;
    this.riders = this.setMarkerColor(this.riders);
    this.riders = this.trackDisconnectedTime(this.riders);
  }

  setMarkerColor(riders) {
    let user = this.userService.user$.value;
    riders = riders.map(rider => {
      rider.color = rider.colorNumber + 3;
      rider.zInd = rider.zIndex;

      // Disconnected rider
      if ( rider.disconnected ) {
        rider.color = 0;
        rider.opacity = .5;
        rider.zInd = 0 - rider.zIndex;
      }

      // Ride leader
      if ( rider.leader === true ) {
        rider.color = 2;
        rider.zInd = rider.zIndex + 1000;
      }

      // The user's own marker
      if ( user && user._id === rider._id ) {
        rider.color = 1;
        rider.zInd = rider.zIndex + 2000;
      }

      return rider;
    });
    return riders;
  }

  trackDisconnectedTime(riders) {
    riders.forEach(rider => {
      if ( rider.disconnected ) {
        clearInterval(this.timer[ rider._id ]);
        this.timer[ rider._id ] = setInterval(() => {
          // Todo: Show seconds up to a minute, and then minutes.
          this.minutes[ rider._id ] = Math.round((Date.now() - rider.disconnectTime) / 1000);
        }, 1000);
      } else {
        this.minutes[ rider._id ] = 0;
        clearInterval(this.timer[ rider._id ]);
      }
    });

    return riders;
  }

  removeLongDisconnectedRiders() {
    this.timer2 = setInterval(() => {
      this.riders = _.filter(this.riders, (rider) => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnectTime) < 1800000;
      });
    }, 30000);
  }

  setMapMode(mapMode) {
    this.mapMode = mapMode;
    switch ( mapMode ) {
      case 'trackAllRiders':
        this.showAllRiders();
        break;
      case 'trackUser':
        this.focusOnUser();
        break;
      case 'stationary':
        if ( this.coordsSub ) this.coordsSub.unsubscribe();
        break;
      default:
        // Todo: Do I need to handle this? This will never be reached if things work correctly.
        break;
    }
  }

  focusOnUser() {
    this.bounds = new this.google.maps.LatLngBounds();
    if ( this.coordsSub ) this.coordsSub.unsubscribe();
    this.coordsSub = this.riderService.coords$.subscribe(coords => {
          if ( coords ) {
            this.bounds.extend({ lat: coords.lat, lng: coords.lng });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("MapComponent.trackUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
  }

  showAllRiders() {
    // Todo: This doesn't track the user; it only sets the bounds once.
    this.bounds = new this.google.maps.LatLngBounds();
    this.riders.forEach(rider => {
      if ( rider.lat && rider.lng ) { // Just a safety precaution. Should not be needed.
        this.bounds.extend({ lat: rider.lat, lng: rider.lng })
      }
    });
    this.latLng = this.bounds.toJSON();
  }

  listenForNewRider() {
    this.riderService.newRider$.subscribe(rider => this.riders.push(rider));
  }

  listenForUpdateRiderPosition() {
    this.riderService.updatedRider$.subscribe(updatedRider => {
      let index = _.findIndex(this.riders, rider => rider._id === updatedRider._id);
      this.riders[index].lat = updatedRider.lat;
      this.riders[index].lng = updatedRider.lng;
    });
  }

  listenForDisconnectedRider() {
    this.riderService.disconnectedRider$.subscribe(disconnectedRider => {
      let index = _.findIndex(this.riders, rider => rider._id === disconnectedRider._id);
        this.riders[index].disconnected = true;
        this.riders[index].disconnectTime = disconnectedRider.disconnectTime;
    });
  }

  listenForRemoveRider() {
    this.riderService.removedRider$.subscribe(removedRider => {
      this.riders = this.riders.filter(rider => rider._id !== removedRider._id);
    });
  }

  ngOnDestroy() {
    if ( this.riderSub ) this.riderSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();
    if ( this.coordsSub ) this.coordsSub.unsubscribe();
    if ( this.navBarStateSub ) this.navBarStateSub.unsubscribe();
    this.riders.forEach(rider => clearInterval(this.timer[ rider._id ]));
    clearInterval(this.timer2);
    clearTimeout(this.navBarStateTimer);
    setTimeout(() => {
      this.miscService.navBarState$.next('show');
    }, 200);

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);

  }

}

