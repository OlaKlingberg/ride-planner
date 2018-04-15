import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
  templateUrl: './cuesheet-view.component.html',
  styleUrls: [ './cuesheet-view.component.scss' ]
})
export class CuesheetViewComponent implements OnInit {
  cuesheet: Cuesheet;
  cuesheetId: string = '';  // routerLink in the template doesn't work with cuesheet?._id. Hence this solution.
  demoMode = false;
  total: number = 0;
  user: User = null;

  constructor(private cuesheetService: CuesheetService,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.cuesheetId = this.route.snapshot.paramMap.get('id');

    this.getCuesheet(this.cuesheetId);
    this.subscribeToUser();
  }

  getCuesheet(cuesheetId) {
    this.cuesheetService.getCuesheet(cuesheetId)
        .then(cuesheet => {
          this.setTotalDistances(cuesheet);
        });
  }

  setTotalDistances(cuesheet) {
    cuesheet.cues = cuesheet.cues.map(cue => {
      this.total += cue.distance;
      cue.total = this.total;
      return cue;
    });

    this.cuesheet = cuesheet;
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
