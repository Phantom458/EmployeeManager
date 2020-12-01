import { TestBed } from '@angular/core/testing';

import { LeaveManagerFacadeService } from './leave-manager-facade.service';

describe('LeaveManagerFacadeService', () => {
  let service: LeaveManagerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
