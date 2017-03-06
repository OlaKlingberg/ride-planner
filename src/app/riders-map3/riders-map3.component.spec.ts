import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersMap3Component } from './riders-map3.component';

describe('RidersMap3Component', () => {
  let component: RidersMap3Component;
  let fixture: ComponentFixture<RidersMap3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidersMap3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersMap3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
