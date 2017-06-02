import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

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
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'rp-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit, OnDestroy {
  public production = environment.production;
  private fullName: string = '';
  public maxZoom: number = 18;

  public user: User;

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private riderSub: Subscription;
  private userSub: Subscription;
  private positionSub: Subscription;
  private navBarStateSub: Subscription;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];

  private socket: Socket;
  public debugMessages: Array<string> = [];

  // private timer: Array<any> = [];
  private timer2: any;
  public navBarStateTimer: any;

  private zCounter: number = 0;

  // public minutes: Array<number> = [];

  public mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'focusOnUser';

  public riderList: Array<User> = [];


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('userInfoWindow') userInfoWindow;
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
    this.listenForJoinedRider();
    this.listenForUpdatedRiderPosition();
    this.listenForRemovedRider();
    this.listenForDisconnectedRider();
    this.removeLongDisconnectedRiders();
    console.log("About to load mapsAPILoader.");
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();
    });
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
      this.fullName = user ? user.fullName : null;  // This actually seems to be necessary!
      if ( user && user.ride ) this.getRiderList();
    });
  }

  // When the nav bar becomes shown, set a timer to hide it again -- but only if the accordion is closed.
  subscribeToNavBarState() {
    this.navBarStateSub = this.miscService.navBarState$
        .combineLatest(this.userService.position$)
        .subscribe(([ navBarState, position ]) => {
          // Start the timer to hide the nav bar only when the map is shown, which happens when there are coords.
          if ( position ) {
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

  // Todo: Should these functions be moved to RiderService and just be called from here?
  getRiderList() {
    console.log("MapComponent.getRiderList()");
    this.socket.emit('giveMeRiderList', this.user.ride);
    this.socket.on('riderList', riderList => {
      this.riderList = riderList.map(rider => new User(rider));
      // Filter out the user, which will be displayed using a separate marker.
      this.riderList = this.riderList.filter(rider => rider._id !== this.user._id);
      this.setZIndexAndOpacity();
    });
  }

  setZIndexAndOpacity() {
    this.riderList = this.riderList.map(rider => {
      rider.zIndex = this.zCounter++;
      if ( rider.leader ) rider.zIndex = rider.zIndex + 500;
      if ( rider.disconnected ) rider.zIndex = rider.zIndex * -1;
      return rider;
    });
  }

  listenForJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        this.getRiderList();
      } else {
        joinedRider = new User(joinedRider);
        joinedRider.zIndex = this.zCounter++;
        if ( joinedRider.leader ) joinedRider.zIndex += 500;
        console.log("listenForNewRider(). rider:", joinedRider);
        // The rider might be a new rider or a disconnected rider who reconnected.
        this.riderList = this.riderList.filter(rider => rider._id !== joinedRider._id);
        this.riderList.push(joinedRider);
      }
    });
  }

  listenForUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      console.log("listenForUpdatedRiderPosition(). updatedRider:", updatedRider);
      let idx = _.findIndex(this.riderList, rider => rider._id === updatedRider._id);
      this.riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
      this.riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
      this.riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
      this.riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;
    });
  }

  listenForRemovedRider() {
    this.socket.on('removedRider', _id => {
      console.log("listenForRemovedRider(). _id:", _id);
      this.riderList = this.riderList.filter(rider => rider._id !== _id);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      console.log("listenForDisconnectedRider(). disconnectedRider:", disconnectedRider);
      let idx = _.findIndex(this.riderList, rider => rider._id === disconnectedRider._id);
      this.riderList[ idx ].disconnected = disconnectedRider.disconnected;
    });
  }

  removeLongDisconnectedRiders() {
    this.timer2 = setInterval(() => {
      console.log("removeLongDisconnectedRiders. A new 30-second interval started ...");
      this.riderList = _.filter(this.riderList, rider => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnected) < 1800000;
      });
    }, 30000);
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

  setMapMode(mapMode) {
    this.mapMode = mapMode;
    switch ( mapMode ) {
      case 'trackAllRiders':
        this.showAllRiders();
        break;
      case 'trackUser':
        this.focusOnUser();
        break;
      default:
        if ( this.positionSub ) this.positionSub.unsubscribe();
        break;
    }
  }

  focusOnUser() {
    this.bounds = new this.google.maps.LatLngBounds();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    this.positionSub = this.userService.position$.subscribe(position => {
          if ( position ) {
            console.log("focusOnUser(). position$.subscribe(). position:", position);
            this.bounds.extend({ lat: position.coords.latitude, lng: position.coords.longitude });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("MapComponent.trackUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
  }

  showAllRiders() {
    console.log("showAllRiders()");
    // Todo: This doesn't track the user; it only sets the bounds once.
    this.bounds = new this.google.maps.LatLngBounds();
    this.riderList.forEach(rider => {
      this.bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude })
    });
    this.latLng = this.bounds.toJSON();
  }

  ngOnDestroy() {
    // if ( this.riderSub ) this.riderSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();
    // if ( this.coordsSub ) this.coordsSub.unsubscribe();
    if ( this.navBarStateSub ) this.navBarStateSub.unsubscribe();
    // this.riders.forEach(rider => clearInterval(this.timer[ rider._id ]));
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

