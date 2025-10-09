import { EMAIL_PATTERN, PHONE_PATTERN, DNI_PATTERN } from './patterns';

describe('Patterns Constants', () => {
  it('should export EMAIL_PATTERN', () => {
    expect(EMAIL_PATTERN).toBeDefined();
    expect(typeof EMAIL_PATTERN).toBe('string');
    expect(EMAIL_PATTERN).toBe('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
  });

  it('should export PHONE_PATTERN', () => {
    expect(PHONE_PATTERN).toBeDefined();
    expect(typeof PHONE_PATTERN).toBe('string');
    expect(PHONE_PATTERN).toBe('^[0-9]{9}$');
  });

  it('should export DNI_PATTERN', () => {
    expect(DNI_PATTERN).toBeDefined();
    expect(typeof DNI_PATTERN).toBe('string');
    expect(DNI_PATTERN).toBe('/^[a-z]{3}[0-9]{6}[a-z]?$/i');
  });

  it('EMAIL_PATTERN should match valid email format', () => {
    const regex = new RegExp(EMAIL_PATTERN);
    expect(regex.test('test@example.com')).toBe(true);
    expect(regex.test('user.name+tag+sorting@example.com')).toBe(true);
    expect(regex.test('invalid.email')).toBe(false);
    expect(regex.test('@example.com')).toBe(false);
  });

  it('PHONE_PATTERN should match 9-digit numbers', () => {
    const regex = new RegExp(PHONE_PATTERN);
    expect(regex.test('123456789')).toBe(true);
    expect(regex.test('987654321')).toBe(true);
    expect(regex.test('12345678')).toBe(false); // 8 digits
    expect(regex.test('1234567890')).toBe(false); // 10 digits
    expect(regex.test('12345678a')).toBe(false); // contains letter
  });
});