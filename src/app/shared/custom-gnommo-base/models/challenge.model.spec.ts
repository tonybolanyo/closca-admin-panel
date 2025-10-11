import { Challenge } from './challenge.model';

describe('Challenge Model', () => {
  let challenge: Challenge;

  beforeEach(() => {
    challenge = new Challenge();
  });

  it('should create an instance', () => {
    expect(challenge).toBeTruthy();
    expect(challenge instanceof Challenge).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(challenge._id).toBeUndefined();
    expect(challenge.level).toBeUndefined();
    expect(challenge.type).toBeUndefined();
    expect(challenge.fountains).toBeUndefined();
    expect(challenge.backgroundId).toBeUndefined();
    expect(challenge.imageId).toBeUndefined();
    expect(challenge.fillsNeeded).toBeUndefined();
    expect(challenge.fountainsCreatedNeeded).toBeUndefined();
    expect(challenge.fountainsRatedNeeded).toBeUndefined();
    expect(challenge.hydrationFillsNeeded).toBeUndefined();
    expect(challenge.startDate).toBeUndefined();
    expect(challenge.endDate).toBeUndefined();
    expect(challenge.name).toBeUndefined();
    expect(challenge.brandId).toBeUndefined();
    expect(challenge.description).toBeUndefined();
    expect(challenge.closcaPoints).toBeUndefined();
  });

  it('should allow setting properties', () => {
    challenge._id = 'challenge-123';
    challenge.level = 1;
    challenge.type = 'REFILL';
    challenge.fountains = ['fountain-1', 'fountain-2'];
    challenge.backgroundId = 'bg-123';
    challenge.imageId = 'img-456';
    challenge.fillsNeeded = 100;
    challenge.fountainsCreatedNeeded = 5;
    challenge.fountainsRatedNeeded = 3;
    challenge.hydrationFillsNeeded = 50;
    challenge.startDate = 1609459200000;
    challenge.endDate = 1612137600000;
    challenge.name = 'Water Challenge';
    challenge.brandId = 'brand-789';
    challenge.description = 'Complete 100 refills';
    challenge.closcaPoints = 500;

    expect(challenge._id).toBe('challenge-123');
    expect(challenge.level).toBe(1);
    expect(challenge.type).toBe('REFILL');
    expect(challenge.fountains).toEqual(['fountain-1', 'fountain-2']);
    expect(challenge.backgroundId).toBe('bg-123');
    expect(challenge.imageId).toBe('img-456');
    expect(challenge.fillsNeeded).toBe(100);
    expect(challenge.fountainsCreatedNeeded).toBe(5);
    expect(challenge.fountainsRatedNeeded).toBe(3);
    expect(challenge.hydrationFillsNeeded).toBe(50);
    expect(challenge.startDate).toBe(1609459200000);
    expect(challenge.endDate).toBe(1612137600000);
    expect(challenge.name).toBe('Water Challenge');
    expect(challenge.brandId).toBe('brand-789');
    expect(challenge.description).toBe('Complete 100 refills');
    expect(challenge.closcaPoints).toBe(500);
  });

  it('should handle all challenge properties', () => {
    const challengeData = {
      _id: 'challenge-001',
      level: 2,
      type: 'FOUNTAIN_CREATION',
      fountains: ['f1', 'f2', 'f3'],
      backgroundId: 'background-001',
      imageId: 'image-001',
      fillsNeeded: 200,
      fountainsCreatedNeeded: 10,
      fountainsRatedNeeded: 5,
      hydrationFillsNeeded: 150,
      startDate: 1640995200000,
      endDate: 1643673600000,
      name: 'January Challenge',
      brandId: 'brand-001',
      description: 'Create new fountains',
      closcaPoints: 1000,
      backgroundInfo: { url: 'http://example.com/bg.png' },
      imageInfo: { url: 'http://example.com/image.png' },
      brandInfo: { name: 'Closca' },
      private: true
    };

    Object.assign(challenge, challengeData);

    expect(challenge._id).toBe(challengeData._id);
    expect(challenge.level).toBe(challengeData.level);
    expect(challenge.type).toBe(challengeData.type);
    expect(challenge.fountains).toEqual(challengeData.fountains);
    expect(challenge.backgroundId).toBe(challengeData.backgroundId);
    expect(challenge.imageId).toBe(challengeData.imageId);
    expect(challenge.fillsNeeded).toBe(challengeData.fillsNeeded);
    expect(challenge.fountainsCreatedNeeded).toBe(challengeData.fountainsCreatedNeeded);
    expect(challenge.fountainsRatedNeeded).toBe(challengeData.fountainsRatedNeeded);
    expect(challenge.hydrationFillsNeeded).toBe(challengeData.hydrationFillsNeeded);
    expect(challenge.startDate).toBe(challengeData.startDate);
    expect(challenge.endDate).toBe(challengeData.endDate);
    expect(challenge.name).toBe(challengeData.name);
    expect(challenge.brandId).toBe(challengeData.brandId);
    expect(challenge.description).toBe(challengeData.description);
    expect(challenge.closcaPoints).toBe(challengeData.closcaPoints);
    expect(challenge.backgroundInfo).toEqual(challengeData.backgroundInfo);
    expect(challenge.imageInfo).toEqual(challengeData.imageInfo);
    expect(challenge.brandInfo).toEqual(challengeData.brandInfo);
    expect(challenge.private).toBe(challengeData.private);
  });

  it('should handle arrays and objects correctly', () => {
    challenge.fountains = [];
    expect(challenge.fountains).toEqual([]);

    challenge.fountains = ['fountain-1'];
    expect(challenge.fountains.length).toBe(1);
    expect(challenge.fountains[0]).toBe('fountain-1');

    challenge.backgroundInfo = { url: 'test.png', size: 100 };
    expect(challenge.backgroundInfo.url).toBe('test.png');
    expect(challenge.backgroundInfo.size).toBe(100);
  });

  it('should handle numeric values correctly', () => {
    challenge.level = 0;
    challenge.fillsNeeded = 0;
    challenge.closcaPoints = 0;

    expect(challenge.level).toBe(0);
    expect(challenge.fillsNeeded).toBe(0);
    expect(challenge.closcaPoints).toBe(0);
  });

  it('should handle boolean private flag', () => {
    challenge.private = true;
    expect(challenge.private).toBe(true);

    challenge.private = false;
    expect(challenge.private).toBe(false);
  });

  it('should handle undefined/null values gracefully', () => {
    challenge.name = null;
    challenge.description = undefined;
    challenge.level = 0;
    challenge.fountains = [];

    expect(challenge.name).toBeNull();
    expect(challenge.description).toBeUndefined();
    expect(challenge.level).toBe(0);
    expect(challenge.fountains).toEqual([]);
  });
});
