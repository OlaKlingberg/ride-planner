import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CuesheetService } from '../cuesheet.service';
import { Cuesheet } from '../cuesheet';

@Component({
  templateUrl: './cuesheet-list.component.html',
  styleUrls: ['./cuesheet-list.component.scss']
})
export class CuesheetListComponent implements OnInit, OnDestroy {
  cuesheets: Cuesheet[] = [];

  private subscription: Subscription;

  constructor(private cuesheetService: CuesheetService) { }

  ngOnInit() {
    console.log("CuesheetListComponent");
    this.subscription = this.cuesheetService.getCuesheetList()
        .subscribe(cuesheets => this.cuesheets = cuesheets);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
