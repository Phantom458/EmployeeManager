import { TestBed } from '@angular/core/testing';

import { LeaveManagerStateService } from './leave-manager-state.service';

describe('LeaveManagerStateService', () => {
  let service: LeaveManagerStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagerStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
