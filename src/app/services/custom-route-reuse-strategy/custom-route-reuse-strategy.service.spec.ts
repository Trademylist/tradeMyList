import { TestBed } from '@angular/core/testing';

import { CustomRouteReuseStrategyService } from './custom-route-reuse-strategy.service';

describe('CustomRouteReuseStrategyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomRouteReuseStrategyService = TestBed.get(CustomRouteReuseStrategyService);
    expect(service).toBeTruthy();
  });
});
