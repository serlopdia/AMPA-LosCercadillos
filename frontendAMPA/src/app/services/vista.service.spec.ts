import { TestBed } from '@angular/core/testing';

import { VistaService } from './vista.service';

describe('VistaService', () => {
  let service: VistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
