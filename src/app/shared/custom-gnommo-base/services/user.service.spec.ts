import { UserService } from './user.service';

describe('UserService', () => {
  it('should be defined as a class', () => {
    expect(typeof UserService).toBe('function');
    expect(UserService.prototype.deleteAvatarImage).toBeDefined();
    expect(UserService.prototype.getMetrics).toBeDefined();
    expect(UserService.prototype.getCSV).toBeDefined();
    expect(UserService.prototype.getMetricsTotal).toBeDefined();
    expect(UserService.prototype.count).toBeDefined();
    expect(UserService.prototype.invitateCorporateWithCSV).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof UserService.prototype.deleteAvatarImage).toBe('function');
    expect(typeof UserService.prototype.getMetrics).toBe('function');
    expect(typeof UserService.prototype.getCSV).toBe('function');
    expect(typeof UserService.prototype.getMetricsTotal).toBe('function');
    expect(typeof UserService.prototype.count).toBe('function');
    expect(typeof UserService.prototype.invitateCorporateWithCSV).toBe('function');
  });

  it('should extend LoginBaseService', () => {
    expect(UserService.prototype.constructor.name).toBe('UserService');
  });
});
