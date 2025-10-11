import { ProductService } from './product.service';

describe('ProductService', () => {
  it('should be defined as a class', () => {
    expect(typeof ProductService).toBe('function');
    expect(ProductService.prototype.count).toBeDefined();
    expect(ProductService.prototype.editProduct).toBeDefined();
    expect(ProductService.prototype.editProductsStatus).toBeDefined();
    expect(ProductService.prototype.deleteProducts).toBeDefined();
    expect(ProductService.prototype.uploadRewardCodes).toBeDefined();
    expect(ProductService.prototype.uploadProductImages).toBeDefined();
    expect(ProductService.prototype.deleteProductImages).toBeDefined();
    expect(ProductService.prototype.deleteRewardCodes).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ProductService.prototype.count).toBe('function');
    expect(typeof ProductService.prototype.editProduct).toBe('function');
    expect(typeof ProductService.prototype.editProductsStatus).toBe('function');
    expect(typeof ProductService.prototype.deleteProducts).toBe('function');
  });
});
