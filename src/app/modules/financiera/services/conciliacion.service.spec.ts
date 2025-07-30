import { TestBed } from '@angular/core/testing';

import { ConciliacionService } from './conciliacion.service';

describe('ConciliacionServiceService', () => {
  let service: ConciliacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
