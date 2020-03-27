import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/startWith';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { environment } from '../../../environments/environment'
import { MemberListDataSource } from './member-list-datasource';
import { SettingsService } from '../../settings/settings.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../user';
import { UserService } from '../user.service';

import { getBootstrapDeviceSize } from '../../_lib/util';


@Component({
  templateUrl: './member-list.component.html',
  styleUrls: [ './member-list.component.scss' ]
})
export class MemberListComponent implements OnInit {
  dataSource: MemberListDataSource | null;
  demoMode: boolean;
  displayedColumns: string[];
  loading: boolean = false;
  member: User;
  modalRef: BsModalRef;
  numberOfUsers: number;
  socket: Socket;

  private deviceSize: string;
  private subscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private alertService: AlertService,
              private modalService: BsModalService,
              private settingsService: SettingsService,
              private socketService: SocketService,
              private userService: UserService) {
    this.displayColumns();
    this.socket = socketService.socket;
  }

  ngOnInit() {
    this.demoMode = this.settingsService.demoMode;
    this.numberOfUsers = this.userService.userList$.value.length;

    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new MemberListDataSource(this.sort, this.userService);

    const keyup$ = Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged();

    this.subscription = keyup$.subscribe(() => {
      if ( !this.dataSource ) return;
      this.dataSource.filter = this.filter.nativeElement.value;
    });

    window.addEventListener('resize', this.setDeviceSize);

    this.userService.requestAllUsers()
        .then(() => {
          this.numberOfUsers = this.userService.userList$.value.length;
        });
  }

  addDummyMembers() {
    if ( this.userService.userList$.value.length >= 181 ) {
      return this.alertService.error("In his demo, you can't have more than 200 members. That should be enough to try sorting and filtering functionality.");
    }

    this.loading = true;
    this.userService.addDummyMembers()
        .then(res => {
          this.userService.requestAllUsers()
              .then(() => {
                this.alertService.success('Twenty members have been added. They will be removed in an hour.');
                this.loading = false;
                this.numberOfUsers = this.userService.userList$.value.length;
              });
        })
        .catch(e => {
          console.log("Error:", e);
        });
  }

  deleteDummyMembers() {
    this.userService.deleteDummyMembers()
        .then(res => {
          this.userService.requestAllUsers()
              .then(() => {
                this.alertService.success("The dummy members have been deleted.");
                this.numberOfUsers = this.userService.userList$.value.length;
              });
        });
  }

  displayColumns() {
    // console.log(this.userService.user$.value.fname, this.userService.user$.value.admin);
    this.deviceSize = getBootstrapDeviceSize();

    if ( this.deviceSize === 'xs' ) {
      this.displayedColumns = [ 'leader', 'fullName', 'showDetailsButton' ];
    } else if ( this.deviceSize === 'sm' ) {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'showDetailsButton' ]
    } else if ( this.deviceSize === 'md' ) {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'showDetailsButton' ]
    }
    // else if (this.userService.user$.value.email === environment.superAdmin || this.userService.user$.value.admin || this.userService.user$.value.leader) {
    //   this.displayedColumns = [ 'admin', 'leader', 'fullName', 'phone', 'email', 'emergencyName', 'emergencyPhone', 'editButton' ];
    // }
    else {
      this.displayedColumns = [ 'admin', 'leader', 'fullName', 'phone', 'email', 'emergencyName', 'emergencyPhone', 'showDetailsButton' ];
    }
  }

  editMember(_id) {
    console.log("editMember:", _id);
  }

  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
    this.displayColumns();
  }.bind(this);

  showDetails(template: TemplateRef<any>, row) {
    this.member = row;
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy() {
    if ( this.subscription ) this.subscription.unsubscribe();
    window.removeEventListener('resize', this.setDeviceSize);
  }
}
