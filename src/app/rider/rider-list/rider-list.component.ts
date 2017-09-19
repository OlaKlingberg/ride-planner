import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { RiderListDataSource } from './rider-list-datasource';
import { RideSubjectService } from '../../ride/ride-subject.service';
import { Observable } from 'rxjs/Observable';
import { RiderService } from '../rider.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  templateUrl: './rider-list.component.html',
  styleUrls: [ './rider-list.component.scss' ]
})
export class RiderListComponent implements OnInit {
  displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'disconnected' ];
  dataSource: RiderListDataSource | null;
  modalRef: BsModalRef;
  ride: string = '';
  rider: any;

  @ViewChild('filter') filter: ElementRef = null;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private modalService: BsModalService,
              private riderService: RiderService,
              private rideSubjectService: RideSubjectService) {
    this.displayColumns();
  }

  ngOnInit() {
    this.ride = this.rideSubjectService.ride$.value;

    if ( !this.ride ) return;

    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new RiderListDataSource(this.sort, this.riderService);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if ( !this.dataSource ) return;
          this.dataSource.filter = this.filter.nativeElement.value;
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
    console.log(row);
    this.rider = row;
    this.modalRef = this.modalService.show(template);
  }


}
