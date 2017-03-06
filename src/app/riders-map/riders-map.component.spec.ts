import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersMapComponent } from './riders-map.component';

describe('RidersMap2Component', () => {
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





