import { TestBed } from '@angular/core/testing';

import { UserPipeService } from './user-pipe.service';

describe('UserPipeService', () => {
  let service: UserPipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
