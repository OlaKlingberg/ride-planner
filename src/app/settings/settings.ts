export class Settings {
  // api: string;
  bootstrapScreenSize: string;
  demoMode: string;
  dummyPos: string;
  dummyPosAddMin: number;
  dummyPosAddMax: number;
  dummyMov: string;
  dummyMovIncMin: number;
  dummyMovIncMax: number;
  dummyUpdateFreq: number;
  fadeNav: number;

  refreshMapPage: number;
  refreshOnNavigationAfter: number;
  removeLongDisconnectedRiders: number;
  storage: 'sessionStorage' | 'localStorage';

  constructor(obj) {
    this.bootstrapScreenSize = obj.bootstrapScreenSize || 'no';
    this.demoMode = obj.demoMode || 'no';
    this.dummyPos = obj.demoMode || 'no';
    this.dummyPosAddMin = obj.dummyPosAddMin || 2;
    this.dummyPosAddMax = obj.dummyPosAddMax || 5;
    this.dummyMov = obj.dummyMov || 'no';
    this.dummyMovIncMin = obj.dummyMovIncMin || 2;
    this.dummyMovIncMax = obj.dummyMovIncMax || 5;
    this.dummyUpdateFreq = obj.dummyUpdateFreq || 1.5;
    this.fadeNav = obj.fadeNav || 4;
    this.refreshMapPage = obj.refreshMapPage || 1;
    this.refreshOnNavigationAfter = obj.refreshOnNavigationAfter || 30;
    this.removeLongDisconnectedRiders = obj.removeLongDisconnectedRiders || 30;
    this.storage = obj.storage || 'sessionStorage';
  }

  get dummyPosAdd() {
    let dummyPosAdd = ((this.dummyPosAddMax - this.dummyPosAddMin) * Math.random() + this.dummyPosAddMin) / 100000;
    dummyPosAdd *= Math.sign(Math.random() - .5);

    return dummyPosAdd;
  }

  get dummyMovInc() {
    let dummyMovInc = ((this.dummyMovIncMax - this.dummyMovIncMin) * Math.random() + this.dummyMovIncMin) / 100000;
    dummyMovInc *= Math.sign(Math.random() - .5);

    return dummyMovInc;
  }
}