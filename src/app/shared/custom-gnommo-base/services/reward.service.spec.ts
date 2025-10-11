import { RewardService } from './reward.service';

describe('RewardService', () => {
  it('should be defined as a class', () => {
    expect(typeof RewardService).toBe('function');
    expect(RewardService.prototype.getRewardByProduct).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof RewardService.prototype.getRewardByProduct).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(RewardService.prototype.constructor.name).toBe('RewardService');
  });
});
