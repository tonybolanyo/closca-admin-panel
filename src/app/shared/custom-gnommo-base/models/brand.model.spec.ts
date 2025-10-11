import { Brand, BrandStatus } from './brand.model';

describe('Brand Model', () => {
  let brand: Brand;

  beforeEach(() => {
    brand = new Brand('brand-123', 'Closca');
  });

  it('should create an instance', () => {
    expect(brand).toBeTruthy();
    expect(brand instanceof Brand).toBe(true);
  });

  it('should initialize with constructor parameters', () => {
    expect(brand._id).toBe('brand-123');
    expect(brand.name).toBe('Closca');
  });

  it('should have optional properties defined', () => {
    expect(brand.imageId).toBeUndefined();
    expect(brand.fountains).toBeUndefined();
    expect(brand.brandStatus).toBeUndefined();
    expect(brand.brandLogo).toBeUndefined();
  });

  it('should allow setting properties', () => {
    brand.imageId = 'img-456';
    brand.fountains = { count: 10 };
    brand.brandStatus = BrandStatus.ACTIVE;
    brand.brandLogo = 'logo.png';

    expect(brand.imageId).toBe('img-456');
    expect(brand.fountains).toEqual({ count: 10 });
    expect(brand.brandStatus).toBe(BrandStatus.ACTIVE);
    expect(brand.brandLogo).toBe('logo.png');
  });

  it('should handle all brand properties', () => {
    const brandData = {
      _id: 'brand-001',
      name: 'Test Brand',
      imageId: 'image-001',
      fountains: { total: 25, active: 20 },
      brandStatus: BrandStatus.PENDING,
      brandLogo: 'test-logo.svg'
    };

    Object.assign(brand, brandData);

    expect(brand._id).toBe(brandData._id);
    expect(brand.name).toBe(brandData.name);
    expect(brand.imageId).toBe(brandData.imageId);
    expect(brand.fountains).toEqual(brandData.fountains);
    expect(brand.brandStatus).toBe(brandData.brandStatus);
    expect(brand.brandLogo).toBe(brandData.brandLogo);
  });

  it('should handle different brand statuses', () => {
    brand.brandStatus = BrandStatus.ACTIVE;
    expect(brand.brandStatus).toBe(BrandStatus.ACTIVE);
    expect(brand.brandStatus).toBe(0);

    brand.brandStatus = BrandStatus.INACTIVE;
    expect(brand.brandStatus).toBe(BrandStatus.INACTIVE);
    expect(brand.brandStatus).toBe(1);

    brand.brandStatus = BrandStatus.PENDING;
    expect(brand.brandStatus).toBe(BrandStatus.PENDING);
    expect(brand.brandStatus).toBe(2);
  });

  it('should handle undefined/null values gracefully', () => {
    brand.imageId = null;
    brand.fountains = undefined;
    brand.brandLogo = null;

    expect(brand.imageId).toBeNull();
    expect(brand.fountains).toBeUndefined();
    expect(brand.brandLogo).toBeNull();
  });

  it('should create instance without name parameter', () => {
    const newBrand = new Brand('brand-456', undefined);
    expect(newBrand._id).toBe('brand-456');
    expect(newBrand.name).toBeUndefined();
  });

  it('should handle fountains as an object', () => {
    brand.fountains = {
      public: 5,
      private: 3,
      sponsored: 2
    };

    expect(brand.fountains).toBeDefined();
    expect(typeof brand.fountains).toBe('object');
    expect((brand.fountains as any).public).toBe(5);
    expect((brand.fountains as any).private).toBe(3);
    expect((brand.fountains as any).sponsored).toBe(2);
  });
});

describe('BrandStatus Enum', () => {
  it('should have ACTIVE status', () => {
    expect(BrandStatus.ACTIVE).toBeDefined();
    expect(BrandStatus.ACTIVE).toBe(0);
  });

  it('should have INACTIVE status', () => {
    expect(BrandStatus.INACTIVE).toBeDefined();
    expect(BrandStatus.INACTIVE).toBe(1);
  });

  it('should have PENDING status', () => {
    expect(BrandStatus.PENDING).toBeDefined();
    expect(BrandStatus.PENDING).toBe(2);
  });

  it('should have exactly 3 statuses', () => {
    const statusCount = Object.keys(BrandStatus).filter(key => isNaN(Number(key))).length;
    expect(statusCount).toBe(3);
  });

  it('should support reverse mapping', () => {
    expect(BrandStatus[0]).toBe('ACTIVE');
    expect(BrandStatus[1]).toBe('INACTIVE');
    expect(BrandStatus[2]).toBe('PENDING');
  });
});
