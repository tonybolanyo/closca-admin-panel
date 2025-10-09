import { MyDateAdapter } from './datepicker-angular-material.service';

describe('MyDateAdapter', () => {
  let adapter: MyDateAdapter;

  beforeEach(() => {
    // MyDateAdapter extends NativeDateAdapter which requires matDateLocale and platform
    adapter = new MyDateAdapter(undefined, {} as any);
  });

  it('should create', () => {
    expect(adapter).toBeTruthy();
  });

  it('should format date to Spanish locale string', () => {
    const testDate = new Date(2023, 5, 15); // June 15, 2023
    const formattedDate = adapter.format(testDate, 'input');
    
    // The exact format may vary based on locale, but it should be a string
    expect(typeof formattedDate).toBe('string');
    expect(formattedDate).toContain('15');
    expect(formattedDate).toContain('6'); // Month might be 06 or 6
    expect(formattedDate).toContain('2023');
  });

  it('should return 1 as first day of week (Monday)', () => {
    expect(adapter.getFirstDayOfWeek()).toBe(1);
  });

  it('should convert numbers to 2-digit format', () => {
    // Access private method through any cast for testing
    const result1 = (adapter as any)._to2digit(5);
    const result2 = (adapter as any)._to2digit(15);
    
    expect(result1).toBe('05');
    expect(result2).toBe('15');
  });
});