import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MemberListDataSource } from './member-list-datasource';
import { UserService } from '../user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  displayedColumns = ['fullName', 'fname', 'phone', 'email', 'emergencyName', 'emergencyPhone'];
  dataSource: MemberListDataSource | null;

  @ViewChild(MdSort) sort: MdSort;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    // Todo: It seems wrong to have to include this.userService in this method call. How do I get rid of that?
    this.dataSource = new MemberListDataSource(this.sort, this.userService)
  }
}
