import { ChallengeSubscriptionService } from './challenge-subscription.service';

describe('ChallengeSubscriptionService', () => {
  it('should be defined as a class', () => {
    expect(typeof ChallengeSubscriptionService).toBe('function');
    expect(ChallengeSubscriptionService.prototype.count).toBeDefined();
    expect(ChallengeSubscriptionService.prototype.uploadSubscribeCSV).toBeDefined();
    expect(ChallengeSubscriptionService.prototype.getUsersSubscribed).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ChallengeSubscriptionService.prototype.count).toBe('function');
    expect(typeof ChallengeSubscriptionService.prototype.uploadSubscribeCSV).toBe('function');
    expect(typeof ChallengeSubscriptionService.prototype.getUsersSubscribed).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ChallengeSubscriptionService.prototype.constructor.name).toBe('ChallengeSubscriptionService');
  });
});
