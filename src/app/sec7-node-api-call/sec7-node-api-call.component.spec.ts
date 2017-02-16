/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Sec7NodeApiCallComponent } from './sec7-node-api-call.component';

describe('Sec7NodeApiCallComponent', () => {
  let component: Sec7NodeApiCallComponent;
  let fixture: ComponentFixture<Sec7NodeApiCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sec7NodeApiCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sec7NodeApiCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
