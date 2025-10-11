import { Onboarding } from './onboarding.model';

describe('Onboarding Model', () => {
  let onboarding: Onboarding;

  beforeEach(() => {
    onboarding = new Onboarding();
  });

  it('should create an instance', () => {
    expect(onboarding).toBeTruthy();
    expect(onboarding instanceof Onboarding).toBe(true);
  });

  it('should have optional properties defined', () => {
    expect(onboarding._id).toBeUndefined();
    expect(onboarding.title).toBeUndefined();
    expect(onboarding.description).toBeUndefined();
    expect(onboarding.image).toBeUndefined();
    expect(onboarding.imageInfo).toBeUndefined();
    expect(onboarding.icon).toBeUndefined();
    expect(onboarding.iconInfo).toBeUndefined();
  });

  it('should allow setting properties', () => {
    onboarding._id = 'onboarding-123';
    onboarding.title = 'Welcome';
    onboarding.description = 'Welcome to Closca';
    onboarding.image = 'welcome.png';
    onboarding.imageInfo = { url: 'http://example.com/welcome.png' };
    onboarding.icon = 'icon.png';
    onboarding.iconInfo = { url: 'http://example.com/icon.png' };

    expect(onboarding._id).toBe('onboarding-123');
    expect(onboarding.title).toBe('Welcome');
    expect(onboarding.description).toBe('Welcome to Closca');
    expect(onboarding.image).toBe('welcome.png');
    expect(onboarding.imageInfo).toEqual({ url: 'http://example.com/welcome.png' });
    expect(onboarding.icon).toBe('icon.png');
    expect(onboarding.iconInfo).toEqual({ url: 'http://example.com/icon.png' });
  });

  it('should handle all onboarding properties', () => {
    const onboardingData = {
      _id: 'onboarding-001',
      title: 'Step 1',
      description: 'First step in onboarding',
      image: 'step1.jpg',
      imageInfo: { width: 800, height: 600 },
      icon: 'step1-icon.svg',
      iconInfo: { width: 48, height: 48 }
    };

    Object.assign(onboarding, onboardingData);

    expect(onboarding._id).toBe(onboardingData._id);
    expect(onboarding.title).toBe(onboardingData.title);
    expect(onboarding.description).toBe(onboardingData.description);
    expect(onboarding.image).toBe(onboardingData.image);
    expect(onboarding.imageInfo).toEqual(onboardingData.imageInfo);
    expect(onboarding.icon).toBe(onboardingData.icon);
    expect(onboarding.iconInfo).toEqual(onboardingData.iconInfo);
  });

  it('should handle objects for image and icon info', () => {
    onboarding.imageInfo = { url: 'test.png', size: 1000 };
    onboarding.iconInfo = { url: 'icon.svg', color: 'blue' };

    expect(onboarding.imageInfo.url).toBe('test.png');
    expect(onboarding.imageInfo.size).toBe(1000);
    expect(onboarding.iconInfo.url).toBe('icon.svg');
    expect(onboarding.iconInfo.color).toBe('blue');
  });

  it('should handle undefined/null values gracefully', () => {
    onboarding.title = null;
    onboarding.description = undefined;
    onboarding.imageInfo = null;

    expect(onboarding.title).toBeNull();
    expect(onboarding.description).toBeUndefined();
    expect(onboarding.imageInfo).toBeNull();
  });
});
