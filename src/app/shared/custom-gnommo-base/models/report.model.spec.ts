import { Report, ReportType } from './report.model';

describe('Report Model', () => {
  it('should create an instance', () => {
    const report = new Report();
    expect(report).toBeTruthy();
    expect(report).toBeInstanceOf(Report);
  });

  it('should allow setting properties', () => {
    const report = new Report();
    report.reportType = ReportType.WATER_NOT_POTABLE;
    report.text = 'Water quality issue';
    report.userId = 'user-123';
    report.fountainId = 'fountain-456';

    expect(report.reportType).toBe(ReportType.WATER_NOT_POTABLE);
    expect(report.text).toBe('Water quality issue');
    expect(report.userId).toBe('user-123');
    expect(report.fountainId).toBe('fountain-456');
  });

  it('should handle ReportType enum', () => {
    expect(ReportType.FOUNTAIN_NOT_EXIST).toBeDefined();
    expect(ReportType.WATER_NOT_POTABLE).toBeDefined();
    expect(ReportType.INFORMATION_ERROR).toBeDefined();
    expect(ReportType.OTHERS).toBeDefined();
  });

  it('should handle fountain info reference', () => {
    const report = new Report();
    report.fountainInfo = {} as any;
    
    expect(report.fountainInfo).toBeDefined();
  });
});
