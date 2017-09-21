import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MemberListDataSource } from './member-list-datasource';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Observable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MemberListDataSource | null;
  member: any;
  modalRef: BsModalRef;

  private subscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private modalService: BsModalService,
              private userService: UserService) {
    this.displayColumns();
  }

  ngOnInit() {
    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new MemberListDataSource(this.sort, this.userService);

    const keyup$ = Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged();

    this.subscription = keyup$.subscribe(() => {
          if (!this.dataSource) return;
          this.dataSource.filter = this.filter.nativeElement.value;
        });

    // Todo: Refactor this so that I can removeEventListeners OnDestroy.
    window.addEventListener('resize', () => {
      this.displayColumns();
    });
  }

  addTenMembers() {
    this.userService.addTenMembers()
        .then(() => {

        });
  }

  displayColumns() {
    if ( window.innerWidth >= 900 ) {
      this.displayedColumns = ['fullName', 'phone', 'email', 'emergencyName', 'emergencyPhone'];
    } else if (window.innerWidth >= 700) {
      this.displayedColumns = ['fullName', 'phone', 'emergencyName', 'emergencyPhone', 'showDetailsButton']
    } else {
      this.displayedColumns = ['fullName', 'phone', 'showDetailsButton'];
    }
  }

  showDetails(template: TemplateRef<any>, row) {
    console.log(row);
    this.member = row;
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
