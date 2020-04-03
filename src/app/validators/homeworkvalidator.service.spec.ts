import { TestBed } from '@angular/core/testing';

import { HomeworkvalidatorService } from './homeworkvalidator.service';

describe('HomeworkvalidatorService', () => {
  let service: HomeworkvalidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeworkvalidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
