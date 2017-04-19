import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: [ './user-list.component.scss' ]
})
export class UserListComponent implements OnInit {
  private users: Array<object>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAllUsers()
        .subscribe((response) => {
          this.users = response.json();
        });
  }

}
