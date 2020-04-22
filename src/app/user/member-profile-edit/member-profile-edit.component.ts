import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { environment } from '../../../environments/environment';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  templateUrl: './member-profile-edit.component.html',
  styleUrls: [ './member-profile-edit.component.scss' ]
})
export class MemberProfileEditComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  member: any = {};
  superAdmin = environment.superAdmin;
  updateUserSub: Subscription;
  user: User;

  private userSub: Subscription;

  constructor(private alertService: AlertService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToUser();
    this.requestMember(this.route.snapshot.paramMap.get('id'));
  }

  deleteMember() {
    this.loading = true;
    this.userService.deleteMember(this.member).then(() => {
      this.alertService.success(`Member ${this.member.fname} ${this.member.lname} was deleted`, true, true);
      this.router.navigate([`/members`]);
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  requestMember(memberId) {
    this.userService.requestUser(memberId)
        .then(member => {
          this.member = member;
        });
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
      console.log(`User is: ${user.email}`);
      console.log(`SuperAdmin is ${this.superAdmin}`);
      console.log(`User is SuperAdmin: ${user.email == this.superAdmin}`);
    });
  }

  update() {
    this.loading = true;
    this.userService.update(this.member).then(() => {
          this.alertService.success('Profile updated', true, true);
          this.router.navigate([`/members/${this.member._id}`]);
        },
        error => {
          this.loading = false;
          console.log(error);
        }
    )
  }

  ngOnDestroy() {
    if ( this.userSub ) this.userSub.unsubscribe();
    if ( this.updateUserSub ) this.updateUserSub.unsubscribe();
  }
}
