import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CuesheetDemoService } from '../cuesheet-demo.service';
import { Cuesheet } from '../cuesheet';

@Component({
  templateUrl: './cuesheet-list.component.html',
  styleUrls: [ './cuesheet-list.component.scss' ]
})
export class CuesheetListDemoComponent implements OnInit {
  cuesheets: Cuesheet[] = [];

  private subscription: Subscription;

  constructor(private cuesheetDemoService: CuesheetDemoService) {
  }

  ngOnInit() {
    this.subscription = this.cuesheetDemoService.cuesheets$.subscribe(cuesheets => {
      this.cuesheets = cuesheets;
      // console.log("CuesheetListDemo.ngOnInit(). cuesheets:", cuesheets);
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
