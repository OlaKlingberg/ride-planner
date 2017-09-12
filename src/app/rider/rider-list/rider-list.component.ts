import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { RiderListDataSource} from './rider-list-datasource';
import { RiderService } from '../rider.service';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { Observable } from 'rxjs/Observable';


import { UserService } from '../../user/user.service';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit, OnDestroy {
  displayedColumns = ['fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected'];
  dataSource: RiderListDataSource | null;
  ride: string = '';

  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private riderService: RiderService,
              private rideSubjectService: RideSubjectService,
              // private socketService: SocketService,
              private userService: UserService) {
    // this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.ride = this.rideSubjectService.ride$.value;
    // this.subscribeToRiderListide();
    // this.subscribeToRiderList();
    // this.subscribeToUser();
    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?

    if (this.ride) {
      this.dataSource = new RiderListDataSource(this.sort, this.riderService);
      console.log("ride:", this.ride);
      console.log("filter:", this.filter);


      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
    }


  }

  // subscribeToRide() {
  //   let sub = this.rideSubjectService.ride$.subscribe(ride => {
  //     this.ride = ride;
  //   });
  //   this.subscriptions.push(sub);
  // }
  //
  // subscribeToRiderList() {
  //   let sub = this.riderService.riderList$.subscribe(riderList => {
  //     this.riderList = riderList;
  //   });
  //   this.subscriptions.push(sub);
  // }
  //
  // subscribeToUser() {
  //   let sub = this.userService.user$.subscribe(user => {
  //     this.user = user;
  //     if ( user.ride ) this.riderService.emitGiveMeRiderList(user);
  //   });
  //   this.subscriptions.push(sub);
  // }

  ngOnDestroy() {
    // this.subscriptions.forEach(sub => {
    //   return sub.unsubscribe();
    // });
  }

}
