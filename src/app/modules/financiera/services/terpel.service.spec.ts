import { TestBed } from '@angular/core/testing';

import { TerpelService } from './terpel.service';

describe('TerpelService', () => {
  let service: TerpelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerpelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
