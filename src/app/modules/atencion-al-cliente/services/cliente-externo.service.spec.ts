import { TestBed } from '@angular/core/testing';

import { ClienteExternoService } from './cliente-externo.service';

describe('ClienteExternoService', () => {
  let service: ClienteExternoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteExternoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
