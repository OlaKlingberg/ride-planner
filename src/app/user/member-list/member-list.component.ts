import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MemberListDataSource } from './member-list-datasource';
import { TestDatabase } from './test-database';
import { UserService } from '../user.service';
// import { UserService } from '../user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'email', 'emergencyContact', 'emergencyPhone'];
  testDatabase = new TestDatabase(this.userService);
  dataSource: MemberListDataSource | null;

  @ViewChild(MdSort) sort: MdSort;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.dataSource = new MemberListDataSource(this.testDatabase, this.sort)
  }
}
