/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RidersMap2Component } from './riders-map2.component';

describe('RidersMap2Component', () => {
  let component: RidersMap2Component;
  let fixture: ComponentFixture<RidersMap2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidersMap2Component ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersMap2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
