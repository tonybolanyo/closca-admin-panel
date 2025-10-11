import { ChallengeService } from './challenges.service';

describe('ChallengeService', () => {
  it('should be defined as a class', () => {
    expect(typeof ChallengeService).toBe('function');
    expect(ChallengeService.prototype.updateOrder).toBeDefined();
    expect(ChallengeService.prototype.count).toBeDefined();
    expect(ChallengeService.prototype.pause).toBeDefined();
    expect(ChallengeService.prototype.createMultipart).toBeDefined();
    expect(ChallengeService.prototype.updateMultipart).toBeDefined();
    expect(ChallengeService.prototype.getUsersTarget).toBeDefined();
    expect(ChallengeService.prototype.getMetrics).toBeDefined();
    expect(ChallengeService.prototype.getRanking).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ChallengeService.prototype.updateOrder).toBe('function');
    expect(typeof ChallengeService.prototype.count).toBe('function');
    expect(typeof ChallengeService.prototype.pause).toBe('function');
  });
});
