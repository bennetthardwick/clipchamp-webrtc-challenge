import { TestBed, inject } from '@angular/core/testing';

import { ChatAuthGuardService } from './chat-auth-guard.service';

describe('ChatAuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatAuthGuardService]
    });
  });

  it('should be created', inject([ChatAuthGuardService], (service: ChatAuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
