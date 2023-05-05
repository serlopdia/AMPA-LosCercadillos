import { TestBed } from '@angular/core/testing';

import { SocioGuard } from './socio.guard';

describe('SocioGuard', () => {
  let guard: SocioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SocioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
