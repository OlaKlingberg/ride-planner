import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { nameSort } from '../../_lib/util';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: [ './user-list.component.scss' ]
})
export class UserListComponent implements OnInit, OnDestroy {
  // users: Array<User>;
  users: User[];

  private subscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAllUsers()
        .then(data => {
          this.users = data;
          this.users.sort(nameSort);
        }); // Todo: Handle errors.
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
