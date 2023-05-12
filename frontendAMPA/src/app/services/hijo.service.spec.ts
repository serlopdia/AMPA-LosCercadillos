import { TestBed } from '@angular/core/testing';

import { HijoService } from './hijo.service';

describe('HijoService', () => {
  let service: HijoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HijoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
