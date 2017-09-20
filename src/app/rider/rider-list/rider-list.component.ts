import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
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

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
  dataSource: RiderListDataSource | null;
  modalRef: BsModalRef;
  ride: string = '';
  rider: any;

  private subscription: Subscription;

  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private modalService: BsModalService,
              private positionService: PositionService,
              private riderService: RiderService,
              private rideSubjectService: RideSubjectService) {
    this.displayColumns();
  }

  ngOnInit() {
    // Todo: Refactor? The app won't request riderList until the user has a position, so I have to request a position here, in case the user enters the app on this page. But this doesn't seem like an ideal setup.
    this.positionService.getPosition();

    this.ride = this.rideSubjectService.ride$.value;

    if ( !this.ride ) return;

    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new RiderListDataSource(this.sort, this.riderService);

    const keyup$ = Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged();

    this.subscription = keyup$.subscribe(() => {
      if ( !this.dataSource ) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });

    // Todo: Refactor this so that I can removeEventListeners OnDestroy.
    window.addEventListener('resize', () => {
      this.displayColumns();
    });
  }

  displayColumns() {
    if ( window.innerWidth >= 800 ) {
      this.displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
    } else {
      this.displayedColumns = [ 'fullName', 'phone', 'showDetailsButton' ];
    }
  }

  showDetails(template: TemplateRef<any>, row) {
    this.rider = row;
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if ( this.subscription ) this.subscription.unsubscribe();
  }

}
