import { TestBed } from '@angular/core/testing';

import { SignupvalidatorService } from './signupvalidator.service';

describe('SignupvalidatorService', () => {
  let service: SignupvalidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupvalidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
