import { BottleType } from './bottle-type.model';

describe('BottleType Model', () => {
  let bottleType: BottleType;

  beforeEach(() => {
    bottleType = new BottleType('type-123', 'Classic');
  });

  it('should create an instance', () => {
    expect(bottleType).toBeTruthy();
    expect(bottleType instanceof BottleType).toBe(true);
  });

  it('should initialize with constructor parameters', () => {
    expect(bottleType._id).toBe('type-123');
    expect(bottleType.name).toBe('Classic');
  });

  it('should have optional properties defined', () => {
    expect(bottleType.color).toBeUndefined();
    expect(bottleType.image).toBeUndefined();
    expect(bottleType.imageInfo).toBeUndefined();
  });

  it('should allow setting properties', () => {
    bottleType.color = 'blue';
    bottleType.image = 'bottle-image.png';
    bottleType.imageInfo = { url: 'http://example.com/image.png' };

    expect(bottleType.color).toBe('blue');
    expect(bottleType.image).toBe('bottle-image.png');
    expect(bottleType.imageInfo).toEqual({ url: 'http://example.com/image.png' });
  });

  it('should handle all bottle type properties', () => {
    const typeData = {
      _id: 'type-001',
      name: 'Premium',
      color: 'red',
      image: 'premium.jpg',
      imageInfo: { width: 100, height: 100 }
    };

    Object.assign(bottleType, typeData);

    expect(bottleType._id).toBe(typeData._id);
    expect(bottleType.name).toBe(typeData.name);
    expect(bottleType.color).toBe(typeData.color);
    expect(bottleType.image).toBe(typeData.image);
    expect(bottleType.imageInfo).toEqual(typeData.imageInfo);
  });

  it('should handle undefined/null values gracefully', () => {
    bottleType.color = null;
    bottleType.image = undefined;

    expect(bottleType.color).toBeNull();
    expect(bottleType.image).toBeUndefined();
  });

  it('should create instance without name parameter', () => {
    const newType = new BottleType('type-456', undefined);
    expect(newType._id).toBe('type-456');
    expect(newType.name).toBeUndefined();
  });
});
