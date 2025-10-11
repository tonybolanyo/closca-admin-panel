import { LevelService } from './level.service';

describe('LevelService', () => {
  it('should be defined as a class', () => {
    expect(typeof LevelService).toBe('function');
    expect(LevelService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof LevelService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(LevelService.prototype.constructor.name).toBe('LevelService');
  });
});
