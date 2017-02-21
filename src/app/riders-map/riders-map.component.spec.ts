/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RidersMapComponent } from './riders-map.component';

describe('RidersMapComponent', () => {
  let component: RidersMapComponent;
  let fixture: ComponentFixture<RidersMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidersMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RidersMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
