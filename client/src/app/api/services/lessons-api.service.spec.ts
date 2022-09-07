import { TestBed } from '@angular/core/testing';

import { LessonsApiService } from './lessons-api.service';

describe('LessonsApiService', () => {
  let service: LessonsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
