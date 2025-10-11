import { Bottle } from './bottle.model';

describe('Bottle Model', () => {
  let bottle: Bottle;

  beforeEach(() => {
    bottle = new Bottle();
  });

  it('should create an instance', () => {
    expect(bottle).toBeTruthy();
    expect(bottle instanceof Bottle).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(bottle._id).toBeUndefined();
    expect(bottle.serialNumber).toBeUndefined();
    expect(bottle.userId).toBeUndefined();
    expect(bottle.bottleTypeId).toBeUndefined();
  });

  it('should allow setting properties', () => {
    bottle._id = 'bottle-123';
    bottle.serialNumber = 'SN123456';
    bottle.userId = 'user-456';
    bottle.bottleTypeId = 'type-789';

    expect(bottle._id).toBe('bottle-123');
    expect(bottle.serialNumber).toBe('SN123456');
    expect(bottle.userId).toBe('user-456');
    expect(bottle.bottleTypeId).toBe('type-789');
  });

  it('should handle all bottle properties', () => {
    const bottleData = {
      _id: 'bottle-001',
      serialNumber: 'ABC123XYZ',
      userId: 'user-001',
      bottleTypeId: 'type-001'
    };

    Object.assign(bottle, bottleData);

    expect(bottle._id).toBe(bottleData._id);
    expect(bottle.serialNumber).toBe(bottleData.serialNumber);
    expect(bottle.userId).toBe(bottleData.userId);
    expect(bottle.bottleTypeId).toBe(bottleData.bottleTypeId);
  });

  it('should handle undefined/null values gracefully', () => {
    bottle.serialNumber = null;
    bottle.userId = undefined;

    expect(bottle.serialNumber).toBeNull();
    expect(bottle.userId).toBeUndefined();
  });
});
