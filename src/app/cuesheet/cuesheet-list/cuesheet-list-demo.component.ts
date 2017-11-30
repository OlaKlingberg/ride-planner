import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Cuesheet } from '../cuesheet';
import { CuesheetDemoService } from '../cuesheet-demo.service';

@Component({
  templateUrl: './cuesheet-list.component.html',
  styleUrls: [ './cuesheet-list.component.scss' ]
})
export class CuesheetListDemoComponent implements OnInit {
  cuesheets: Cuesheet[] = [];

  private subscription: Subscription;

  constructor(private cuesheetDemoService: CuesheetDemoService) { }

  ngOnInit() {
    this.cuesheetDemoService.getCuesheetList().then((cuesheets: Cuesheet[]) => {
      this.cuesheets = cuesheets;
    })
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
