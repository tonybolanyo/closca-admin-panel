import { ProductTypesService } from './product-types.service';

describe('ProductTypesService', () => {
  it('should be defined as a class', () => {
    expect(typeof ProductTypesService).toBe('function');
    expect(ProductTypesService.prototype.count).toBeDefined();
    expect(ProductTypesService.prototype.editProductType).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ProductTypesService.prototype.count).toBe('function');
    expect(typeof ProductTypesService.prototype.editProductType).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ProductTypesService.prototype.constructor.name).toBe('ProductTypesService');
  });
});
