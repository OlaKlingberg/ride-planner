import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
import { PositionService } from './position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';


@Injectable()
export class RefreshService {

  constructor(private positionService: PositionService,
              private rideSubjectService: RideSubjectService,
              private userService: UserService) {
    // this.retrieveState();
  }

  refresh() {
    let position: Position = this.positionService.position$.value;
    let ride: string = this.rideSubjectService.ride$.value;
    let user: User = this.userService.user$.value;

    environment.storage.setItem('position', JSON.stringify(position));
    environment.storage.setItem('ride', ride);
    environment.storage.setItem('user', JSON.stringify(user));

    window.location.reload();
  }

  retrieveState() {
    let position: Position = JSON.parse(environment.storage.getItem('position'));
    let ride: string = environment.storage.getItem('ride');
    let user: User = new User(JSON.parse(environment.storage.getItem('user')));
    console.log("postion:", position);
    console.log("ride:", ride);
    console.log("user:", user);

    this.positionService.position$.next(position);
    this.rideSubjectService.ride$.next(ride);
    this.userService.user$.next(user);
  }


}