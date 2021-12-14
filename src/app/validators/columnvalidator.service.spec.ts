import { TestBed } from '@angular/core/testing';

import { ColumnvalidatorService } from './columnvalidator.service';

describe('ColumnvalidatorService', () => {
  let service: ColumnvalidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnvalidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
