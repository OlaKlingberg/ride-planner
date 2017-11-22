import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
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
import { SettingsService } from '../../settings/settings.service';

@Component({
  templateUrl: './member-list.component.html',
  styleUrls: [ './member-list.component.scss' ]
})
export class MemberListComponent implements OnInit {
  demoMode: boolean;
  displayedColumns: string[];
  dataSource: MemberListDataSource | null;
  loading: boolean = false;
  member: User;
  modalRef: BsModalRef;
  numberOfUsers: number;
  socket: Socket;

  private subscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private alertService: AlertService,
              private modalService: BsModalService,
              private socketService: SocketService,
              private settingsService: SettingsService,
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

    window.addEventListener('resize', this.displayColumns);

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
                console.log("numberOfUsers:", this.numberOfUsers);
              });
        })
        .catch(e => {
          console.log("Error:", e);
        });
  }

  deleteDummyMembers() {
    this.userService.deleteDummyMembers()
        .then(res => {
          console.log("response:", res);
          this.userService.requestAllUsers()
              .then(() => {
                this.alertService.success("The dummy members have been deleted.");
                this.numberOfUsers = this.userService.userList$.value.length;
              });
        });
  }

  // Todo: Adjust to bootstrap sizes?
  displayColumns = function () { // Can't use ES6 syntax (is that what it is?) here, because I need to bind this for window to have the right value.
    if ( window.innerWidth >= 1000 ) {
      this.displayedColumns = [ 'admin', 'leader', 'fullName', 'phone', 'email', 'emergencyName', 'emergencyPhone' ];
    } else if ( window.innerWidth >= 800 ) {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'emergencyName', 'emergencyPhone', 'showDetailsButton' ]
    } else if ( window.innerWidth >= 500 ) {
      this.displayedColumns = [ 'leader', 'fullName', 'phone', 'showDetailsButton' ]
    } else {
      this.displayedColumns = [ 'leader', 'fullName', 'showDetailsButton' ];
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
