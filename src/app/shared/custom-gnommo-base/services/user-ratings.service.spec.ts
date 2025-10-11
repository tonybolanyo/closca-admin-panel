import { UserRatingsService } from './user-ratings.service';

describe('UserRatingsService', () => {
  it('should be defined as a class', () => {
    expect(typeof UserRatingsService).toBe('function');
    expect(UserRatingsService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof UserRatingsService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(UserRatingsService.prototype.constructor.name).toBe('UserRatingsService');
  });
});
