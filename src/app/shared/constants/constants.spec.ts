import {
  S3_URL,
  PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES,
  STATION_TYPES,
  FOUNTAIN_STATUSES,
  LEVEL_STATUSES
} from './constants';

describe('Constants', () => {
  it('should export S3_URL', () => {
    expect(S3_URL).toBeDefined();
    expect(typeof S3_URL).toBe('string');
    expect(S3_URL).toBe('https://s3-eu-west-1.amazonaws.com/');
  });

  it('should export PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES array', () => {
    expect(PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES).toBeDefined();
    expect(Array.isArray(PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES)).toBe(true);
    expect(PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES.length).toBeGreaterThan(0);
  });

  it('should have correct structure for fountain types', () => {
    PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES.forEach(type => {
      expect(type.name).toBeDefined();
      expect(type.value).toBeDefined();
      expect(typeof type.name).toBe('string');
      expect(typeof type.value).toBe('string');
    });
  });

  it('should include expected fountain types', () => {
    const values = PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES.map(type => type.value);
    expect(values).toContain('PUBLIC');
    expect(values).toContain('RESTAURANT');
    expect(values).toContain('CAFE_BAR');
    expect(values).toContain('HOTEL_HOSTEL');
  });

  it('should export STATION_TYPES array', () => {
    expect(STATION_TYPES).toBeDefined();
    expect(Array.isArray(STATION_TYPES)).toBe(true);
    expect(STATION_TYPES.length).toBe(2);
  });

  it('should have correct station types', () => {
    const values = STATION_TYPES.map(type => type.value);
    expect(values).toContain('WATER_FOUNTAIN');
    expect(values).toContain('FILLING_STATION');
  });

  it('should export FOUNTAIN_STATUSES array', () => {
    expect(FOUNTAIN_STATUSES).toBeDefined();
    expect(Array.isArray(FOUNTAIN_STATUSES)).toBe(true);
    expect(FOUNTAIN_STATUSES.length).toBe(4);
  });

  it('should have correct fountain statuses', () => {
    const values = FOUNTAIN_STATUSES.map(status => status.value);
    expect(values).toContain('PENDING');
    expect(values).toContain('ACTIVE');
    expect(values).toContain('INACTIVE');
    expect(values).toContain('TEMP_CLOSED');
  });

  it('should export LEVEL_STATUSES array', () => {
    expect(LEVEL_STATUSES).toBeDefined();
    expect(Array.isArray(LEVEL_STATUSES)).toBe(true);
    expect(LEVEL_STATUSES.length).toBe(2);
  });

  it('should have correct level statuses', () => {
    const values = LEVEL_STATUSES.map(status => status.value);
    expect(values).toContain('ACTIVE');
    expect(values).toContain('INACTIVE');
  });
});