import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { RiderListDataSource } from './rider-list-datasource';
import { RiderService } from '../rider.service';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
  dataSource: RiderListDataSource | null;
  ride: string = '';

  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private riderService: RiderService,
              private rideSubjectService: RideSubjectService) {
  }

  ngOnInit() {
    this.ride = this.rideSubjectService.ride$.value;
    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?

    if ( !this.ride ) return;

    this.dataSource = new RiderListDataSource(this.sort, this.riderService);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if ( !this.dataSource ) return;
          this.dataSource.filter = this.filter.nativeElement.value;
        });


  }


}
