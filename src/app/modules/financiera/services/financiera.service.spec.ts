import { TestBed } from '@angular/core/testing';

import { FinancieraService } from './financiera.service';

describe('FinancieraService', () => {
  let service: FinancieraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancieraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
