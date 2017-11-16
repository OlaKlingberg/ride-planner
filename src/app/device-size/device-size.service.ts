import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { getBootstrapDeviceSize } from '../_lib/util';

@Injectable()
export class DeviceSizeService {
  bootstrapSize$: BehaviorSubject<string> = new BehaviorSubject(null);
  innerHeight$: BehaviorSubject<number> = new BehaviorSubject(null);
  innerWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  temporarilyHide: boolean = false;

  constructor() {
    setTimeout(() => {
      this.getSize();

    }, 0);
    window.addEventListener('resize', this.getSize);
  }

  // I can't use an arrow function here, because I need to bind "this."
  getSize = function () {
    this.bootstrapSize$.next(getBootstrapDeviceSize());
    this.innerHeight$.next(window.innerHeight);
    this.innerWidth$.next(window.innerWidth);
    this.temporarilyHide = false;
  }.bind(this);


}
