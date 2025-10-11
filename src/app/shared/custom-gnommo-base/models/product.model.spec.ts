import { Product, ProductStatus } from './product.model';

describe('Product Model', () => {
  it('should create an instance', () => {
    const product = new Product();
    expect(product).toBeTruthy();
    expect(product).toBeInstanceOf(Product);
  });

  it('should allow setting properties', () => {
    const product = new Product();
    product.name = 'Test Product';
    product.description = 'A test product';
    product.price = 29.99;
    product.discount = 10;
    product.status = ProductStatus.VISIBLE;
    product.stock = 100;

    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('A test product');
    expect(product.price).toBe(29.99);
    expect(product.discount).toBe(10);
    expect(product.status).toBe(ProductStatus.VISIBLE);
    expect(product.stock).toBe(100);
  });

  it('should handle ProductStatus enum', () => {
    expect(ProductStatus.VISIBLE).toBeDefined();
    expect(ProductStatus.INVISIBLE).toBeDefined();
    expect(ProductStatus.OUT_OF_STOCK).toBeDefined();
  });

  it('should handle array properties', () => {
    const product = new Product();
    product.size = ['S', 'M', 'L'];

    expect(product.size).toEqual(['S', 'M', 'L']);
    expect(product.size.length).toBe(3);
  });

  it('should handle image IDs', () => {
    const product = new Product();
    product.imageId = 'img-123';
    product.descriptionImageId = 'desc-img-456';

    expect(product.imageId).toBe('img-123');
    expect(product.descriptionImageId).toBe('desc-img-456');
  });
});
