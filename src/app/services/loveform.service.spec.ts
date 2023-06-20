import { TestBed } from '@angular/core/testing';

import { LoveformService } from './loveform.service';

describe('LoveformService', () => {
  let service: LoveformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoveformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
