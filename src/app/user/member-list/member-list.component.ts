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
import Socket = SocketIOClient.Socket;
import { SocketService } from '../../core/socket.service';
import { User } from '../user';
import { AlertService } from '../../alert/alert.service';

@Component({
  templateUrl: './member-list.component.html',
  styleUrls: [ './member-list.component.scss' ]
})
export class MemberListComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MemberListDataSource | null;
  loading: boolean = false;
  member: User;
  modalRef: BsModalRef;
  socket: Socket;

  private subscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;

  constructor(private alertService: AlertService,
              private modalService: BsModalService,
              private socketService: SocketService,
              private userService: UserService) {
    this.displayColumns();
    this.socket = socketService.socket;
  }

  ngOnInit() {
    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new MemberListDataSource(this.sort, this.userService);
    console.log("dataSource:", this.dataSource);

    const keyup$ = Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged();

    this.subscription = keyup$.subscribe(() => {
      if ( !this.dataSource ) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });

    window.addEventListener('resize', this.displayColumns);

    this.userService.requestAllUsers();
  }

  addTwentyMembers() {
    if (this.userService.userList$.value.length >= 181) {
      return this.alertService.error("In his demo, you can't have more than 200 members. That should be enough to try sorting and filtering functionality.");
    }

    this.loading = true;
    this.userService.addTwentyMembers()
        .then(res => {
          this.userService.requestAllUsers();
          this.alertService.success('Twenty members have been added.');
          this.loading = false;
        })
        .catch(e => {
          console.log("Error:", e);
        });
  }

  displayColumns = function () {
    if ( window.innerWidth >= 900 ) {
      this.displayedColumns = [ 'fullName', 'phone', 'email', 'emergencyName', 'emergencyPhone' ];
    } else if ( window.innerWidth >= 700 ) {
      this.displayedColumns = [ 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'showDetailsButton' ]
    } else {
      this.displayedColumns = [ 'fullName', 'phone', 'showDetailsButton' ];
    }
  }.bind(this);

  showDetails(template: TemplateRef<any>, row) {
    console.log(row);
    this.member = row;
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if ( this.subscription ) this.subscription.unsubscribe();
    window.removeEventListener('resize', this.displayColumns);
  }

}
