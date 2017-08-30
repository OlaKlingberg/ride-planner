import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
import { PositionService } from './position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';


@Injectable()
export class RefreshService {

  constructor(private positionService: PositionService,
              private userService: UserService) {
  }

  refresh() {
    console.log('RefreshService');
    let position: Position = this.positionService.position$.value;
    let user: User = this.userService.user$.value;

    environment.storage.setItem('rpPosition', JSON.stringify(position));
    environment.storage.setItem('rpUser', JSON.stringify(user));

    window.location.reload();
  }
}