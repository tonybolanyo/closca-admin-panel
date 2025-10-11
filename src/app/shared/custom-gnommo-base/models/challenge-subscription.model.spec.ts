import { ChallengeSubscription, ChallengeStatus } from './challenge-subscription.model';

describe('ChallengeSubscription Model', () => {
  it('should create an instance', () => {
    const subscription = new ChallengeSubscription();
    expect(subscription).toBeTruthy();
    expect(subscription).toBeInstanceOf(ChallengeSubscription);
  });

  it('should allow setting properties', () => {
    const subscription = new ChallengeSubscription();
    subscription.challengeStatus = 'SUSCRIBED';
    subscription.totalRefilled = 50;
    subscription.totalHydrationRefilled = 100;
    subscription.fountainsCreated = 3;
    subscription.fountainsRated = 5;

    expect(subscription.challengeStatus).toBe('SUSCRIBED');
    expect(subscription.totalRefilled).toBe(50);
    expect(subscription.totalHydrationRefilled).toBe(100);
    expect(subscription.fountainsCreated).toBe(3);
    expect(subscription.fountainsRated).toBe(5);
  });

  it('should handle ChallengeStatus enum', () => {
    expect(ChallengeStatus.SUSCRIBED).toBeDefined();
    expect(ChallengeStatus.UNSUSCRIBED).toBeDefined();
    expect(ChallengeStatus.DONE).toBeDefined();
    expect(ChallengeStatus.FAILED).toBeDefined();
  });

  it('should handle numeric counters', () => {
    const subscription = new ChallengeSubscription();
    subscription.totalRefilled = 0;
    subscription.totalHydrationRefilled = 0;

    expect(subscription.totalRefilled).toBe(0);
    expect(subscription.totalHydrationRefilled).toBe(0);
  });
});
