import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { RiderListDataSource } from './rider-list-datasource';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { Observable } from 'rxjs/Observable';
import { RiderService } from '../rider.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { PositionService } from '../../core/position.service';
import { Router } from '@angular/router';
import { User } from '../../user/user';
import { SocketService } from 'app/core/socket.service';
import Socket = SocketIOClient.Socket;

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
  dataSource: RiderListDataSource | null;
  riderDetailsModalRef: BsModalRef;
  ride: string = '';
  rider: User;

  private gettingRidersModalRef: BsModalRef;
  private socket: Socket;
  private subKeyUp: Subscription;
  private subRiderList: Subscription;
  private url: string;

  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild('gettingRiders') gettingRiders: BsModalRef;
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
      // console.log(this.dataSource.data);
      // console.log(typeof this.dataSource.data);
      if ( !this.dataSource ) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });

    // Todo: Refactor this so that I can removeEventListeners OnDestroy.
    window.addEventListener('resize', () => {
      this.displayColumns();
    });
  }

  // Todo: Adjust to bootstrap sizes?
  displayColumns() {
    if ( window.innerWidth >= 700 ) {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
    } else {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'showDetailsButton' ];
    }
  }

  goToRideSelect() {
    // console.log("url:", this.url);
    this.router.navigate([ './ride/select' ], { queryParams: { returnUrl: this.url } });
  }

  showDetails(template: TemplateRef<any>, row) {
    this.rider = row;
    this.riderDetailsModalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if ( this.subKeyUp ) this.subKeyUp.unsubscribe();
    if ( this.subRiderList ) this.subRiderList.unsubscribe();
  }

}
