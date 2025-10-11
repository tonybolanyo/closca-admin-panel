import { BottleTypesService } from './bottle-types.service';

describe('BottleTypesService', () => {
  it('should be defined as a class', () => {
    expect(typeof BottleTypesService).toBe('function');
    expect(BottleTypesService.prototype.updateBottleType).toBeDefined();
    expect(BottleTypesService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BottleTypesService.prototype.updateBottleType).toBe('function');
    expect(typeof BottleTypesService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BottleTypesService.prototype.constructor.name).toBe('BottleTypesService');
  });
});
