import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    // Mock DomSanitizer
    sanitizer = {
      bypassSecurityTrustResourceUrl: jest.fn((value: string) => `safe:${value}`)
    } as any;

    pipe = new SafePipe(sanitizer);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform url using bypassSecurityTrustResourceUrl', () => {
    const testUrl = 'https://example.com/resource';
    const result = pipe.transform(testUrl);
    
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(testUrl);
    expect(result).toBe(`safe:${testUrl}`);
  });

  it('should handle null/undefined input', () => {
    pipe.transform(null);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(null);
    
    pipe.transform(undefined);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(undefined);
  });
});