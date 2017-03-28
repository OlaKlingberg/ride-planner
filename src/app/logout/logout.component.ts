import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pr-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Todo: Set the user as logged out.
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
  }

}
