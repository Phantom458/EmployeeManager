import { TestBed } from '@angular/core/testing';

import { LeaveManagerInterceptorService } from './leave-manager-interceptor.service';

describe('TokenInterceptorService', () => {
  let service: LeaveManagerInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveManagerInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
