import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { nameSort } from '../_lib/util';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rp-user-list',
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
        });
  }

  ngOnDestroy() {
    this.getAllUsersSub.unsubscribe();
  }

}
