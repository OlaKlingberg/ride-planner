import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { nameSort } from '../../_lib/util';
import { UserService } from '../user.service';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: [ './user-list.component.scss' ]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: Array<object>;

  private getAllUsersSub: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.getAllUsersSub = this.userService.getAllUsers()
        .subscribe(response => {
          this.users = response.json().users;
          this.users.sort(nameSort);
        }); // Todo: Handle errors.
  }

  ngOnDestroy() {
    this.getAllUsersSub.unsubscribe();
  }

}
