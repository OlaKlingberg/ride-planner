import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/startWith';
import Socket = SocketIOClient.Socket;

import { getBootstrapDeviceSize } from '../../_lib/util';
import { PositionService } from '../../core/position.service';
import { RiderListDataSource } from './rider-list-datasource';
import { RiderService } from '../rider.service';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { Router } from '@angular/router';
import { SocketService } from 'app/core/socket.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../user/user';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  dataSource: RiderListDataSource | null;
  displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
  ride: string = '';
  rider: User;
  riderDetailsModalRef: BsModalRef;

  private deviceSize: string;
  private gettingRidersModalRef: BsModalRef;
  private socket: Socket;
  private subKeyUp: Subscription;
  private subRiderList: Subscription;
  private url: string;

  @ViewChild('gettingRiders') gettingRiders: BsModalRef;
  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private modalService: BsModalService,
              private positionService: PositionService,
              private riderService: RiderService,
              private rideSubjectService: RideSubjectService,
              private router: Router,
              private socketService: SocketService) {
    this.socket = this.socketService.socket;
    this.url = router.routerState.snapshot.url;
    this.displayColumns();
  }

  ngOnInit() {
    this.socket.emit('giveMeRiderList');

    // Todo: Refactor? The app won't request availableRides until the user has a position, so I have to request a position here, in case the user enters the app on this page. But this doesn't seem like an ideal setup.
    this.positionService.getPosition();

    this.ride = this.rideSubjectService.ride$.value;

    if ( !this.ride ) return;

    // Todo: This is ugly, and I'm not even sure it will work correctly under all circumstances. The amounts for the delays are arbitrary. Can't I achieve the showing and hiding of the modal in a more straight-forward way?
    setTimeout(() => {
      if ( this.riderService.riderList$.value === null ) {
        this.gettingRidersModalRef = this.modalService.show(this.gettingRiders);
        setTimeout(() => {
          this.riderService.riderListPromise().then(() => {
            if ( this.gettingRidersModalRef ) this.gettingRidersModalRef.hide();
          });
        }, 10);
      }
    }, 300);


    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new RiderListDataSource(this.sort, this.riderService);

    const keyup$ = Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged();

    // Todo: Does this create a new subscription for every keyup? In that case, I have a huge memory leak here -- but I don't think that is the case.
    this.subKeyUp = keyup$.subscribe(() => {
      if ( !this.dataSource ) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });

    window.addEventListener('resize', this.setDeviceSize);
  }

  displayColumns() {
    if ( this.deviceSize === 'xs' || this.deviceSize === 'sm') {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'showDetailsButton' ];
      } else {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
    }
  }

  goToRideSelect() {
    this.router.navigate([ './ride/select' ], { queryParams: { returnUrl: this.url } });
  }

  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
    this.displayColumns();
  }.bind(this);

  showDetails(template: TemplateRef<any>, row) {
    this.rider = row;
    this.riderDetailsModalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if ( this.subKeyUp ) this.subKeyUp.unsubscribe();
    if ( this.subRiderList ) this.subRiderList.unsubscribe();
    window.removeEventListener('resize', this.setDeviceSize);
  }

}
