import { APP_DATE_FORMATS } from './date-formats';

describe('Date Formats Constants', () => {
  it('should export APP_DATE_FORMATS object', () => {
    expect(APP_DATE_FORMATS).toBeDefined();
    expect(typeof APP_DATE_FORMATS).toBe('object');
  });

  it('should have parse configuration', () => {
    expect(APP_DATE_FORMATS.parse).toBeDefined();
    expect(APP_DATE_FORMATS.parse.dateInput).toBeDefined();
  });

  it('should have display configuration', () => {
    expect(APP_DATE_FORMATS.display).toBeDefined();
    expect(APP_DATE_FORMATS.display.dateInput).toBe('input');
  });

  it('should have correct parse dateInput format', () => {
    const dateInput = APP_DATE_FORMATS.parse.dateInput;
    expect(dateInput.month).toBe('short');
    expect(dateInput.year).toBe('numeric');
    expect(dateInput.day).toBe('numeric');
  });

  it('should have correct display monthYearLabel format', () => {
    const monthYearLabel = APP_DATE_FORMATS.display.monthYearLabel;
    expect(monthYearLabel.year).toBe('numeric');
    expect(monthYearLabel.month).toBe('short');
  });

  it('should have correct display dateA11yLabel format', () => {
    const dateA11yLabel = APP_DATE_FORMATS.display.dateA11yLabel;
    expect(dateA11yLabel.year).toBe('numeric');
    expect(dateA11yLabel.month).toBe('long');
    expect(dateA11yLabel.day).toBe('numeric');
  });

  it('should have correct display monthYearA11yLabel format', () => {
    const monthYearA11yLabel = APP_DATE_FORMATS.display.monthYearA11yLabel;
    expect(monthYearA11yLabel.year).toBe('numeric');
    expect(monthYearA11yLabel.month).toBe('long');
  });

  it('should have all required display formats', () => {
    const requiredDisplayFormats = ['dateInput', 'monthYearLabel', 'dateA11yLabel', 'monthYearA11yLabel'];
    
    requiredDisplayFormats.forEach(format => {
      expect(APP_DATE_FORMATS.display[format]).toBeDefined();
    });
  });
});