import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-list.component.html',
  styleUrls: ['./cuesheet-list.component.scss']
})
export class CuesheetListComponent implements OnInit, OnDestroy {
  cuesheets: Array<object> = [];

  private subscription: Subscription;

  constructor(private cuesheetService: CuesheetService) { }

  ngOnInit() {
    this.subscription = this.cuesheetService.getAllCuesheets()
        .subscribe(cuesheets => this.cuesheets = cuesheets);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
