import { ImagesRandomService } from './images-random.service';

describe('ImagesRandomService', () => {
  it('should be defined as a class', () => {
    expect(typeof ImagesRandomService).toBe('function');
    expect(ImagesRandomService.prototype.uploadImages).toBeDefined();
    expect(ImagesRandomService.prototype.deleteImages).toBeDefined();
    expect(ImagesRandomService.prototype.assignToFountains).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ImagesRandomService.prototype.uploadImages).toBe('function');
    expect(typeof ImagesRandomService.prototype.deleteImages).toBe('function');
    expect(typeof ImagesRandomService.prototype.assignToFountains).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ImagesRandomService.prototype.constructor.name).toBe('ImagesRandomService');
  });
});
