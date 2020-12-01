import { TestBed } from '@angular/core/testing';

import { LeaveManagerBlService } from './leave-manager-bl.service';

describe('LeaveManagerBlService', () => {
  let service: LeaveManagerBlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagerBlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
