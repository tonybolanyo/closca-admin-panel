import { HydrationRefillService } from './hydration-refill.service';

describe('HydrationRefillService', () => {
  it('should be defined as a class', () => {
    expect(typeof HydrationRefillService).toBe('function');
    expect(HydrationRefillService.prototype.userRefills).toBeDefined();
    expect(HydrationRefillService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof HydrationRefillService.prototype.userRefills).toBe('function');
    expect(typeof HydrationRefillService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(HydrationRefillService.prototype.constructor.name).toBe('HydrationRefillService');
  });
});
