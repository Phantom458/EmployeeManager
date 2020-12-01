import { TestBed } from '@angular/core/testing';

import { LeaveManagerApiService } from './leave-manager-api.service';

describe('LeaveManagerApiService', () => {
  let service: LeaveManagerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
