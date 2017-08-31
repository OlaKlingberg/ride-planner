import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
import { PositionService } from './position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';


@Injectable()
export class RefreshService {
  private autoRefresh: boolean = null;


  constructor(private positionService: PositionService,
              private userService: UserService) {
    this.autoRefresh = environment.storage.getItem('rpAutoRefresh') === 'true';
    environment.storage.removeItem('rpAutoRefresh');
  }

  checkAutoRefresh() {
    return new Promise((resolve, reject) => {
      console.log("checkAutoRefresh about to resolve:", this.autoRefresh);
      resolve(this.autoRefresh);
    });
  }

  refresh() {
    console.log('RefreshService');
    let position: Position = this.positionService.position$.value;
    let user: User = this.userService.user$.value;

    environment.storage.setItem('rpAutoRefresh', 'true');
    environment.storage.setItem('rpPosition', JSON.stringify(position));
    environment.storage.setItem('rpUser', JSON.stringify(user));

    window.location.reload();
  }





}



