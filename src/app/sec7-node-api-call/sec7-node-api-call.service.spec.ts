/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Sec7NodeApiCallService } from './sec7-node-api-call.service';

describe('Sec7NodeApiCallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Sec7NodeApiCallService]
    });
  });

  it('should ...', inject([Sec7NodeApiCallService], (service: Sec7NodeApiCallService) => {
    expect(service).toBeTruthy();
  }));
});
