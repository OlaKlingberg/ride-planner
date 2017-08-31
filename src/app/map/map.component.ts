import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { MapsAPILoader } from '@agm/core';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import Timer = NodeJS.Timer;
import * as $ from 'jquery'
import * as _ from 'lodash';
import * as Rx from 'rxjs';

import { MapAnimations } from './map.component.animatins';
import { NavService } from '../nav/nav.service';
import { PositionService } from '../core/position.service';
import { SocketService } from '../core/socket.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { RefreshService } from '../core/refresh.service';
import { MapService } from './map.service';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  buttonState: string = 'show';
  colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];
  latLng: LatLngBoundsLiteral;
  mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'focusOnUser';
  markerUrl: string = "assets/img/rider-markers/";
  maxZoom: number = 18;
  riderList: Array<User> = [];
  user: User = null;

  private combinedSub: Subscription;
  private google: any;
  private hideTimer: Timer;
  private intervalTimer: Timer;
  private positionSub: Subscription;
  private refreshTimer: any;
  private riderListSub: Subscription;
  private socket: Socket;
  private userSub: Subscription;

  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('markers') markers;
  @ViewChildren('userInfoWindow') userInfoWindow;

  constructor(private mapsAPILoader: MapsAPILoader,
              private mapService: MapService,
              private navService: NavService,
              private positionService: PositionService,
              private socketService: SocketService,
              private refreshService: RefreshService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.getRiderList();
    this.hideNav();
    // this.listenForUpdatedRiderPosition();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.retrieveMapMode();
    });
    this.positionService.getPosition();
    this.removeLongDisconnectedRiders();
    this.subscribeToUser();
  }

  closeInfoWindows(_id) {
    // This actually works. Apparently, this executes, closing any open infoWindow, before a new one is opened.
    this.infoWindows.forEach(infoWindow => infoWindow.close());
    this.userInfoWindow.forEach(userInfoWindow => userInfoWindow.close());

    // If the above hadn't worked, this is how I would have done it.
    // this.infoWindows.forEach(infoWindow => {
    //   if (infoWindow._el.nativeElement.attributes['data-index'] !== _id) infoWindow.close();
    // });
  }

  getRiderList() {
    this.riderListSub = this.mapService.riderList$.subscribe(riderList => {
      // console.log("MapComponent.getRiderList(). riderList:", riderList);
      this.riderList = riderList;
    });
  }

  hideNav() {
    clearTimeout(this.hideTimer);
    // Wait till the map is shown (which happens when there is a position), set timer for 4s, check that the accordion is not expanded. If it's not, hide the navbar.
    this.positionService.positionPromise().then(() => {
      this.hideTimer = setTimeout(() => {
        let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
        if ( !ariaExpanded ) {
          this.navService.navBarState$.next('hide');
          this.buttonState = 'hide';
        }
      }, 4000);
    });
  }

  refresh() {
    this.refreshTimer = setTimeout(() => {
      environment.storage.setItem('rpMapMode', this.mapMode);
      this.refreshService.refresh();
    }, 30000);
  }

  removeLongDisconnectedRiders() {
    this.intervalTimer = setInterval(() => {
      this.riderList = _.filter(this.riderList, rider => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnected) < 1800000;
      });

      this.mapService.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
    }, 10000);
  }

  retrieveMapMode() {
    const mapMode = environment.storage.getItem('rpMapMode') || 'focusOnUser';
    console.log();
    environment.storage.removeItem('rpMapMode');
    this.setMapMode(mapMode);
  }

  setMapMode(mapMode) {
    if ( this.combinedSub ) this.combinedSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();

    this.mapMode = mapMode;

    clearTimeout(this.refreshTimer);

    if ( mapMode === 'stationary') return;

    // this.refresh();

    const combined = Rx.Observable.combineLatest(this.mapService.riderList$, this.userService.user$);
    this.combinedSub = combined.subscribe(value => {
      const riderList = value[ 0 ];
      const user = value[ 1 ];

      if ( !user.position || !user.position.coords || !user.position.coords.latitude || !user.position.coords.longitude ) return;

      let bounds: LatLngBounds = new this.google.maps.LatLngBounds();

      if ( mapMode === 'showAllRiders' && riderList && riderList.length > 0 ) {
        riderList.forEach(rider => {
          if ( rider.position.coords.latitude && rider.position.coords.longitude ) {
            bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
          }
        });
      }

      // if ( user.position && user.position.coords && user.position.coords.latitude) {
      bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });
      // }

      this.latLng = bounds.toJSON();
      // Add 10% to the map at the upper edge for what is covered by the phone-browser address bar.
      this.latLng.north += (this.latLng.north - this.latLng.south) / 10;
    });

  }


  showNav() {
    this.navService.navBarState$.next('show');
    this.buttonState = 'show';
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.navService.navBarState$.next('show');

    clearTimeout(this.hideTimer);
    clearTimeout(this.refreshTimer);
    clearInterval(this.intervalTimer);

    if ( this.combinedSub.unsubscribe ) this.combinedSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);
  }

}
