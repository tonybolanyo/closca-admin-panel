import { FountainService } from './fountain.service';

describe('FountainService', () => {
  it('should be defined as a class', () => {
    expect(typeof FountainService).toBe('function');
    expect(FountainService.prototype.count).toBeDefined();
    expect(FountainService.prototype.getByLocation).toBeDefined();
    expect(FountainService.prototype.getMetrics).toBeDefined();
    expect(FountainService.prototype.getCSV).toBeDefined();
    expect(FountainService.prototype.getSimpleCSV).toBeDefined();
    expect(FountainService.prototype.createWithCSV).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof FountainService.prototype.count).toBe('function');
    expect(typeof FountainService.prototype.getByLocation).toBe('function');
    expect(typeof FountainService.prototype.getMetrics).toBe('function');
  });
});
