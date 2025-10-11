import { ProductType } from './product-type.model';

describe('ProductType Model', () => {
  let productType: ProductType;

  beforeEach(() => {
    productType = new ProductType();
  });

  it('should create an instance', () => {
    expect(productType).toBeTruthy();
    expect(productType instanceof ProductType).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(productType._id).toBeUndefined();
    expect(productType.name).toBeUndefined();
    expect(productType.description).toBeUndefined();
  });

  it('should allow setting properties', () => {
    productType._id = 'type-123';
    productType.name = 'Bottle';
    productType.description = 'Water bottles';

    expect(productType._id).toBe('type-123');
    expect(productType.name).toBe('Bottle');
    expect(productType.description).toBe('Water bottles');
  });

  it('should handle all product type properties', () => {
    const typeData = {
      _id: 'type-001',
      name: 'Accessory',
      description: 'Bottle accessories and spare parts'
    };

    Object.assign(productType, typeData);

    expect(productType._id).toBe(typeData._id);
    expect(productType.name).toBe(typeData.name);
    expect(productType.description).toBe(typeData.description);
  });

  it('should handle undefined/null values gracefully', () => {
    productType.name = null;
    productType.description = undefined;

    expect(productType.name).toBeNull();
    expect(productType.description).toBeUndefined();
  });
});
