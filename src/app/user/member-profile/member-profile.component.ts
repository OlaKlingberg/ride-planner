import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})
export class MemberProfileComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  member: User;
  user: User;
  fname: string;

  private userSub: Subscription;


  constructor(private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.subscribeToUser();
    this.requestMember(this.route.snapshot.paramMap.get('id'));
  }

  requestMember(memberId) {
    this.userService.requestUser(memberId)
        .then(member => this.member = member);
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if ( this.userSub ) this.userSub.unsubscribe();
  }

}
