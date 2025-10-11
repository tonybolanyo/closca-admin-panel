import { Refill } from './refill.model';

describe('Refill Model', () => {
  let refill: Refill;

  beforeEach(() => {
    refill = new Refill();
  });

  it('should create an instance', () => {
    expect(refill).toBeTruthy();
    expect(refill instanceof Refill).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(refill._id).toBeUndefined();
    expect(refill.userId).toBeUndefined();
    expect(refill.fountainId).toBeUndefined();
    expect(refill.quantity).toBeUndefined();
    expect(refill.sharedQuantity).toBeUndefined();
    expect(refill.shared).toBeUndefined();
  });

  it('should allow setting properties', () => {
    refill._id = 'refill-123';
    refill.userId = 'user-456';
    refill.fountainId = 'fountain-789';
    refill.quantity = 500;
    refill.sharedQuantity = 100;
    refill.shared = true;

    expect(refill._id).toBe('refill-123');
    expect(refill.userId).toBe('user-456');
    expect(refill.fountainId).toBe('fountain-789');
    expect(refill.quantity).toBe(500);
    expect(refill.sharedQuantity).toBe(100);
    expect(refill.shared).toBe(true);
  });

  it('should handle all refill properties', () => {
    const refillData = {
      _id: 'refill-001',
      userId: 'user-001',
      fountainId: 'fountain-001',
      quantity: 750,
      sharedQuantity: 250,
      shared: false
    };

    Object.assign(refill, refillData);

    expect(refill._id).toBe(refillData._id);
    expect(refill.userId).toBe(refillData.userId);
    expect(refill.fountainId).toBe(refillData.fountainId);
    expect(refill.quantity).toBe(refillData.quantity);
    expect(refill.sharedQuantity).toBe(refillData.sharedQuantity);
    expect(refill.shared).toBe(refillData.shared);
  });

  it('should handle numeric values correctly', () => {
    refill.quantity = 0;
    refill.sharedQuantity = 0;

    expect(refill.quantity).toBe(0);
    expect(refill.sharedQuantity).toBe(0);
  });

  it('should handle boolean shared flag', () => {
    refill.shared = true;
    expect(refill.shared).toBe(true);

    refill.shared = false;
    expect(refill.shared).toBe(false);
  });

  it('should handle undefined/null values gracefully', () => {
    refill.userId = null;
    refill.fountainId = undefined;
    refill.quantity = 0;

    expect(refill.userId).toBeNull();
    expect(refill.fountainId).toBeUndefined();
    expect(refill.quantity).toBe(0);
  });
});
