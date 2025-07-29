import { TestBed } from '@angular/core/testing';

import { CausacionesService } from './causaciones.service';

describe('CausacionesService', () => {
  let service: CausacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CausacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
