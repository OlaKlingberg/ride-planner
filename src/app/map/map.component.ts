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
import { environment } from '../../environments/environment';
import { RiderService } from '../rider/rider.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  buttonState: string = null;
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

  @ViewChild('agmMap') agmMap;

  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('markers') markers;
  @ViewChildren('userInfoWindow') userInfoWindow;

  constructor(private mapsAPILoader: MapsAPILoader,
              private navService: NavService,
              private refreshService: RefreshService,
              private riderService: RiderService,
              private positionService: PositionService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToUser();
    this.getRiderList();
    this.hideButtonsOnAutoRefresh();
    this.hideNav();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.retrieveState();
    });
    this.positionService.getPosition();
    this.removeLongDisconnectedRiders();
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
    this.riderListSub = this.riderService.riderList$.subscribe(riderList => {
      setTimeout(() => {
        // Remove the user from riderList. The user will be displayed with a separate marker.
        if (riderList && this.user) this.riderList = this.setZIndexAndOpacity(riderList.filter(rider => rider._id !== this.user._id))
      }, 0);
    });
  }

  hideButtonsOnAutoRefresh() {
    this.refreshService.autoRefreshPromise().then(autoRefresh => {
      this.buttonState = autoRefresh ? 'hide' : 'show';
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
      }, environment.fadeNav);
    });

  }

  refresh() {
    console.log("refresh(). About to set refreshTimer");
    this.refreshTimer = setTimeout(() => {
      console.log("refreshTimer completed");
      if ( this.latLng ) environment.storage.setItem('rpLatLng', JSON.stringify(this.latLng));
      environment.storage.setItem('rpMapMode', this.mapMode);
      this.refreshService.refresh();
    }, environment.refreshOnMapPage);
  }

  removeLongDisconnectedRiders() {
    this.intervalTimer = setInterval(() => {
      this.riderList = _.filter(this.riderList, rider => {
        return !rider.disconnected || (Date.now() - rider.disconnected) < environment.removeLongDisconnectedRiders;
      });

      this.riderService.riderList$.next(this.riderList);
    }, 10000);
  }

  retrieveState() {
    const latLng = JSON.parse(environment.storage.getItem('rpLatLng'));
    environment.storage.removeItem('rpLatLng');
    const mapMode = environment.storage.getItem('rpMapMode') || 'focusOnUser';
    environment.storage.removeItem('rpMapMode');
    this.setMapMode(mapMode, latLng);
  }

  setMapMode(mapMode, latLng) {
    if ( this.combinedSub ) this.combinedSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();

    if ( latLng ) this.latLng = latLng;
    this.mapMode = mapMode;

    clearTimeout(this.refreshTimer);

    if ( mapMode === 'stationary' ) return;

    this.refresh();

    const combined = Rx.Observable.combineLatest(this.riderService.riderList$, this.userService.user$);
    this.combinedSub = combined.subscribe(value => {
      const riderList = value[ 0 ];
      const user = value[ 1 ];

      if ( !user.position || !user.position.coords || !user.position.coords.latitude ) return;

      let bounds: LatLngBounds = new this.google.maps.LatLngBounds();

      if ( mapMode === 'showAllRiders' && riderList && riderList.length > 0 ) {
        riderList.forEach(rider => {
          if ( rider.position.coords.latitude && rider.position.coords.longitude ) {
            bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
          }
        });
      }

      bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });

      this.latLng = bounds.toJSON();
      // Add 10% to the map at the upper edge for what is covered by the phone-browser address bar.
      this.latLng.north += (this.latLng.north - this.latLng.south) / 10;
    });

  }

  setZIndexAndOpacity(riderList) {
    let zCounter: number = 0;
    riderList = riderList.map(rider => {
      rider.zIndex = zCounter++;
      if ( rider.leader ) rider.zIndex = rider.zIndex + 500;
      if ( rider.disconnected ) rider.zIndex = rider.zIndex * -1;

      return rider;
    });

    return riderList;
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
    this.navService.navBarState$.next('show');  // Shouldn't be needed, but just to be on the safe side.

    clearTimeout(this.hideTimer);
    clearTimeout(this.refreshTimer);
    clearInterval(this.intervalTimer);

    if ( this.combinedSub ) this.combinedSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.agmMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);
  }

}
