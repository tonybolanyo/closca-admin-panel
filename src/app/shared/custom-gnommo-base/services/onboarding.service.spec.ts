import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  it('should be defined as a class', () => {
    expect(typeof OnboardingService).toBe('function');
    expect(OnboardingService.prototype.updateOnboarding).toBeDefined();
    expect(OnboardingService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof OnboardingService.prototype.updateOnboarding).toBe('function');
    expect(typeof OnboardingService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(OnboardingService.prototype.constructor.name).toBe('OnboardingService');
  });
});
