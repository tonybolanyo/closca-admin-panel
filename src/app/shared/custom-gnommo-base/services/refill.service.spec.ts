import { RefillService } from './refill.service';

describe('RefillService', () => {
  it('should be defined as a class', () => {
    expect(typeof RefillService).toBe('function');
    expect(RefillService.prototype.userRefills).toBeDefined();
    expect(RefillService.prototype.corporateRefills).toBeDefined();
    expect(RefillService.prototype.countCorporateRefills).toBeDefined();
    expect(RefillService.prototype.fountainRefills).toBeDefined();
    expect(RefillService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof RefillService.prototype.userRefills).toBe('function');
    expect(typeof RefillService.prototype.corporateRefills).toBe('function');
    expect(typeof RefillService.prototype.countCorporateRefills).toBe('function');
    expect(typeof RefillService.prototype.fountainRefills).toBe('function');
    expect(typeof RefillService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(RefillService.prototype.constructor.name).toBe('RefillService');
  });
});
