import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../_services/user.service";

@Component({
  selector: 'rp-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(private router: Router,
              private userService: UserService) {
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
        .subscribe(
            data => {
              this.router.navigate(['/login']);
            },
            error => {
              this.loading = false;
            }
        )
  }

}
