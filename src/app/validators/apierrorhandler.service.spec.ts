import { TestBed } from '@angular/core/testing';

import { ApierrorhandlerService } from './apierrorhandler.service';

describe('ApierrorhandlerService', () => {
  let service: ApierrorhandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApierrorhandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
