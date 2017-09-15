import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuesheetBikeIframeComponent } from './cuesheet-bike-iframe.component';

describe('CuesheetBikeIframeComponent', () => {
  let component: CuesheetBikeIframeComponent;
  let fixture: ComponentFixture<CuesheetBikeIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuesheetBikeIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuesheetBikeIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
