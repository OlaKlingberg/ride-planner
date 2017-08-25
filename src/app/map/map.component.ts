import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import { MapsAPILoader } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import Socket = SocketIOClient.Socket;
import * as $ from 'jquery'
import * as _ from 'lodash';
import { environment } from '../../environments/environment';
import { User } from '../user/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PositionService } from '../core/position.service';
import { UserService } from '../user/user.service';
import { SocketService } from '../core/socket.service';
import { NavService } from '../nav/nav.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { MapAnimations } from './map.component.animatins';
import Timer = NodeJS.Timer;

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  public production = environment.production;
  private fullName: string = '';
  public maxZoom: number = 18;
  // public zoom: number = 14;

  public user: User;

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private userSub: Subscription;
  private userRideSub: Subscription;
  private positionSub: Subscription;
  private riderListSub: Subscription;

  private markerUrl: string = "assets/img/rider-markers/";
  private colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];

  private socket: Socket;

  private timer: any;
  public navBarStateTimer: any;

  private zCounter: number = 0;

  public mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'focusOnUser';

  public riderList: Array<User> = [];
  private riderList$: BehaviorSubject<Array<User>> = new BehaviorSubject(null);

  public buttonState: string = 'show';

  private hideTimer: Timer;


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('userInfoWindow') userInfoWindow;
  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  constructor(private positionService: PositionService,
              private socketService: SocketService,
              private mapsAPILoader: MapsAPILoader,
              private navService: NavService,
              private rideSubjectService: RideSubjectService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.hideNav();
    this.subscribeToUser();
    this.listenForSocketConnection();
    this.requestRiderList();
    this.listenForRiderList();
    this.listenForJoinedRider();
    this.listenForUpdatedRiderPosition();
    this.listenForRemovedRider();
    this.listenForDisconnectedRider();
    this.loadMapsAPILoader();
    this.removeLongDisconnectedRiders();

  }

  hideNav() {
    clearTimeout(this.hideTimer);
    // Wait till the map is shown (which happens when there is a position), sait timer for 4s, check that the accordion is not expanded. If it's not, hide the navbar.
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

  showNav() {
    this.navService.navBarState$.next('show');
    this.buttonState = 'show';
  }

  loadMapsAPILoader() {
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();
    });
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  listenForSocketConnection() {
    this.socket.on('socketConnection', () => this.requestRiderList());
  }

  requestRiderList() {
    this.rideSubjectService.ride$.subscribe(ride => {
      if ( ride ) {
        this.socket.emit('giveMeRiderList', ride);
      }
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

  listenForRiderList() {
    this.socket.on('riderList', riderList => {
      // console.log('riderList:', riderList);
      this.riderList = riderList.map(rider => new User(rider));
      // Filter out the user, which will be displayed using a separate marker.
      this.riderList = this.riderList.filter(rider => rider._id !== this.user._id);
      this.setZIndexAndOpacity();
    });
  }

  listenForJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        console.log("Counter reached 1000! About to emit giveMeRiderList.");
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        if ( joinedRider._id !== this.user._id ) {
          joinedRider = new User(joinedRider);
          joinedRider.zIndex = this.zCounter++;
          if ( joinedRider.leader ) joinedRider.zIndex += 500;
          // joinedRider = this.setDummyMovement(joinedRider);
          // console.log("listenForJoinedRider(). rider:", joinedRider);
          // The rider can be a new rider, or a disconnected rider who reconnected.
          this.riderList = this.riderList.filter(rider => rider._id !== joinedRider._id);
          this.riderList.push(joinedRider);

          this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
        }
      }
    });
  }

  listenForUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      let idx = _.findIndex(this.riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        this.riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        this.riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        this.riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        this.riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
      }
    });
  }

  listenForRemovedRider() {
    this.socket.on('removedRider', _id => {
      // console.log("listenForRemovedRider(). _id:", _id);
      this.riderList = this.riderList.filter(rider => rider._id !== _id);

      // This will be used to set the map bounds.
      this.riderList$.next(this.riderList);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      let idx = _.findIndex(this.riderList, rider => rider._id === disconnectedRider._id);
      this.riderList[ idx ].disconnected = disconnectedRider.disconnected;

      this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
    });
  }

  removeLongDisconnectedRiders() {
    this.timer = setInterval(() => {
      this.riderList = _.filter(this.riderList, rider => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnected) < 1800000;
      });

      this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
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
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();

    this.mapMode = mapMode;

    switch ( mapMode ) {
      case 'focusOnUser':
        this.focusOnUser();
        break;
      case 'showAllRiders':
        this.showAllRiders();
        break;
      default:
        break;
    }
  }

  // Todo: Update bounds only if position has changed more than a certain amount.
  focusOnUser() {
    if ( this.positionSub ) this.positionSub.unsubscribe();
    this.positionSub = this.positionService.position$.subscribe(position => {
          if ( position ) {
            this.bounds = new this.google.maps.LatLngBounds();
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
    if ( this.riderListSub ) this.riderListSub.unsubscribe();
    this.riderListSub = this.riderList$.subscribe(riderList => {
      if ( !riderList || riderList.length < 0 ) return;
      this.bounds = new this.google.maps.LatLngBounds();
      riderList.forEach(rider => {
        this.bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
      });
      this.bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });
      this.latLng = this.bounds.toJSON();
      // Add 10% to the map at the upper edge for what is covered by the phone-browser address bar.
      this.latLng.north += (this.latLng.north - this.latLng.south) / 10;
    });

  }

  ngOnDestroy() {
    if ( this.userSub ) this.userSub.unsubscribe();
    if ( this.userRideSub ) this.userRideSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();

    this.socket.removeAllListeners();

    clearInterval(this.timer);
    clearTimeout(this.navBarStateTimer);

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);
  }

}
