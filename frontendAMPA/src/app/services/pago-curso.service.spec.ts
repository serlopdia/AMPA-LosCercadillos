import { TestBed } from '@angular/core/testing';

import { PagoCursoService } from './pago-curso.service';

describe('PagoCursoService', () => {
  let service: PagoCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
