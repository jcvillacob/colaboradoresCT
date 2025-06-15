import { TestBed } from '@angular/core/testing';

import { ConciliacionServiceService } from './conciliacion-service.service';

describe('ConciliacionServiceService', () => {
  let service: ConciliacionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConciliacionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
