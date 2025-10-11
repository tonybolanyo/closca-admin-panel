import { ReportService } from './reports.service';

describe('ReportService', () => {
  it('should be defined as a class', () => {
    expect(typeof ReportService).toBe('function');
    expect(ReportService.prototype.sendFeedbackEmail).toBeDefined();
    expect(ReportService.prototype.count).toBeDefined();
  });

  it('should have public methods defined', () => {
    expect(typeof ReportService.prototype.sendFeedbackEmail).toBe('function');
    expect(typeof ReportService.prototype.count).toBe('function');
  });

  it('should extend BaseService', () => {
    expect(ReportService.prototype.constructor.name).toBe('ReportService');
  });
});
