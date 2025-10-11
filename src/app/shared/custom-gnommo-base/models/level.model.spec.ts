import { Level } from './level.model';

describe('Level Model', () => {
  let level: Level;

  beforeEach(() => {
    level = new Level('level-123', 'BRONZE');
  });

  it('should create an instance', () => {
    expect(level).toBeTruthy();
    expect(level instanceof Level).toBe(true);
  });

  it('should initialize with constructor parameters', () => {
    expect(level._id).toBe('level-123');
    expect(level.code).toBe('BRONZE');
  });

  it('should have optional properties defined', () => {
    expect(level.name).toBeUndefined();
    expect(level.description).toBeUndefined();
    expect(level.status).toBeUndefined();
    expect(level.badger).toBeUndefined();
    expect(level.minRefills).toBeUndefined();
    expect(level.maxRefills).toBeUndefined();
    expect(level.refillReward).toBeUndefined();
    expect(level.fountainCreationReward).toBeUndefined();
    expect(level.totalUsers).toBeUndefined();
  });

  it('should allow setting properties', () => {
    level.name = 'Bronze Level';
    level.description = 'Entry level';
    level.status = 'ACTIVE';
    level.badger = 'bronze-icon.png';
    level.minRefills = 0;
    level.maxRefills = 50;
    level.refillReward = 5;
    level.fountainCreationReward = 10;
    level.totalUsers = 100;

    expect(level.name).toBe('Bronze Level');
    expect(level.description).toBe('Entry level');
    expect(level.status).toBe('ACTIVE');
    expect(level.badger).toBe('bronze-icon.png');
    expect(level.minRefills).toBe(0);
    expect(level.maxRefills).toBe(50);
    expect(level.refillReward).toBe(5);
    expect(level.fountainCreationReward).toBe(10);
    expect(level.totalUsers).toBe(100);
  });

  it('should handle all level properties', () => {
    const levelData = {
      _id: 'level-001',
      code: 'SILVER',
      name: 'Silver Level',
      description: 'Intermediate level',
      status: 'ACTIVE',
      badger: 'silver-badge.png',
      minRefills: 51,
      maxRefills: 200,
      refillReward: 10,
      fountainCreationReward: 20,
      totalUsers: 500
    };

    Object.assign(level, levelData);

    expect(level._id).toBe(levelData._id);
    expect(level.code).toBe(levelData.code);
    expect(level.name).toBe(levelData.name);
    expect(level.description).toBe(levelData.description);
    expect(level.status).toBe(levelData.status);
    expect(level.badger).toBe(levelData.badger);
    expect(level.minRefills).toBe(levelData.minRefills);
    expect(level.maxRefills).toBe(levelData.maxRefills);
    expect(level.refillReward).toBe(levelData.refillReward);
    expect(level.fountainCreationReward).toBe(levelData.fountainCreationReward);
    expect(level.totalUsers).toBe(levelData.totalUsers);
  });

  it('should handle numeric values correctly', () => {
    level.minRefills = 0;
    level.maxRefills = 1000;
    level.refillReward = 15;
    level.totalUsers = 0;

    expect(level.minRefills).toBe(0);
    expect(level.maxRefills).toBe(1000);
    expect(level.refillReward).toBe(15);
    expect(level.totalUsers).toBe(0);
  });

  it('should handle undefined/null values gracefully', () => {
    level.name = null;
    level.description = undefined;
    level.minRefills = 0;

    expect(level.name).toBeNull();
    expect(level.description).toBeUndefined();
    expect(level.minRefills).toBe(0);
  });

  it('should create instance without code parameter', () => {
    const newLevel = new Level('level-456', undefined);
    expect(newLevel._id).toBe('level-456');
    expect(newLevel.code).toBeUndefined();
  });
});
