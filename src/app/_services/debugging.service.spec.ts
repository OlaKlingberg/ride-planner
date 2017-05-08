import { TestBed, inject } from '@angular/core/testing';

import { DebuggingService } from './debugging.service';

describe('DebuggingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebuggingService]
    });
  });

  it('should ...', inject([DebuggingService], (service: DebuggingService) => {
    expect(service).toBeTruthy();
  }));
});
