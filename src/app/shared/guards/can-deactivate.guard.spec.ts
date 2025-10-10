import { CanDeactivateGuard, CanComponentDeactivate } from './can-deactivate.guard';
import { of } from 'rxjs';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;

  beforeEach(() => {
    guard = new CanDeactivateGuard();
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when component does not have canDeactivate method', () => {
    const component = {} as CanComponentDeactivate;
    
    const result = guard.canDeactivate(component);
    
    expect(result).toBe(true);
  });

  it('should call component canDeactivate method when it exists', () => {
    const mockCanDeactivate = jest.fn().mockReturnValue(true);
    const component: CanComponentDeactivate = {
      canDeactivate: mockCanDeactivate
    };
    
    const result = guard.canDeactivate(component);
    
    expect(mockCanDeactivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when component canDeactivate returns false', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false
    };
    
    const result = guard.canDeactivate(component);
    
    expect(result).toBe(false);
  });

  it('should handle Observable return from canDeactivate', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => of(true)
    };
    
    const result = guard.canDeactivate(component);
    
    expect(typeof result).toBe('object'); // Observable
  });

  it('should handle Promise return from canDeactivate', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => Promise.resolve(false)
    };
    
    const result = guard.canDeactivate(component);
    
    expect(result instanceof Promise).toBe(true);
  });
});