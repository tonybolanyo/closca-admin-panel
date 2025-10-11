import { BrandService } from './brands.service';

describe('BrandService', () => {
  it('should be defined as a class', () => {
    expect(typeof BrandService).toBe('function');
    expect(BrandService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof BrandService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(BrandService.prototype.constructor.name).toBe('BrandService');
  });
});
