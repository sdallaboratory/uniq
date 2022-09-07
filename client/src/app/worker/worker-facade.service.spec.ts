import { TestBed } from '@angular/core/testing';

import { WorkerFacadeService } from './worker-facade.service';

describe('WorkerFacadeService', () => {
  let service: WorkerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
