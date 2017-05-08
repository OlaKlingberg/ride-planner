import { TestBed, async, inject } from '@angular/core/testing';

import { RideLeaderGuard } from './ride-leader.guard';

describe('RideLeaderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RideLeaderGuard]
    });
  });

  it('should ...', inject([RideLeaderGuard], (guard: RideLeaderGuard) => {
    expect(guard).toBeTruthy();
  }));
});
