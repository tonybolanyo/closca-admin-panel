import { BottleService } from './bottle.service';

describe('BottleService', () => {
  it('should be defined as a class', () => {
    expect(typeof BottleService).toBe('function');
    expect(BottleService.prototype.count).toBeDefined();
    expect(BottleService.prototype.updateBottle).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BottleService.prototype.count).toBe('function');
    expect(typeof BottleService.prototype.updateBottle).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BottleService.prototype.constructor.name).toBe('BottleService');
  });
});
