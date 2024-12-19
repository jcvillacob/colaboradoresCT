import { TestBed } from '@angular/core/testing';

import { CloudfleetService } from './cloudfleet.service';

describe('CloudfleetService', () => {
  let service: CloudfleetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudfleetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
