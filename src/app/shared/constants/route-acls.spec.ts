import { ROUTE_ACLS } from './route-acls';
import { ROUTER_DEFINITIONS } from './router-definitions';

describe('Route ACLs Constants', () => {
  it('should be defined as a Map', () => {
    expect(ROUTE_ACLS).toBeDefined();
    expect(ROUTE_ACLS instanceof Map).toBe(true);
  });

  it('should have entries', () => {
    expect(ROUTE_ACLS.size).toBeGreaterThan(0);
  });

  it('should have admin access to home route', () => {
    const key = 'ADMIN.' + ROUTER_DEFINITIONS.home;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have manager access to home route', () => {
    const key = 'MANAGER.' + ROUTER_DEFINITIONS.home;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have admin access to wizard route', () => {
    const key = 'ADMIN.' + ROUTER_DEFINITIONS.wizard;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have manager access to wizard route', () => {
    const key = 'MANAGER.' + ROUTER_DEFINITIONS.wizard;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have admin access to users route', () => {
    const key = 'ADMIN.' + ROUTER_DEFINITIONS.users;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have manager access to users route', () => {
    const key = 'MANAGER.' + ROUTER_DEFINITIONS.users;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have admin access to levels route', () => {
    const key = 'ADMIN.' + ROUTER_DEFINITIONS.levels;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have admin access to corporates route', () => {
    const key = 'ADMIN.' + ROUTER_DEFINITIONS.corporates;
    expect(ROUTE_ACLS.has(key)).toBe(true);
    expect(ROUTE_ACLS.get(key)).toBe(true);
  });

  it('should have admin and manager access to sponsored fountains route', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.sponsoredFountains;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.sponsoredFountains;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.get(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
    expect(ROUTE_ACLS.get(managerKey)).toBe(true);
  });

  it('should have admin and manager access to challenges route', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.challenges;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.challenges;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.get(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
    expect(ROUTE_ACLS.get(managerKey)).toBe(true);
  });

  it('should have admin and manager access to products route', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.products;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.products;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.get(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
    expect(ROUTE_ACLS.get(managerKey)).toBe(true);
  });

  it('should have all values set to true', () => {
    ROUTE_ACLS.forEach((value) => {
      expect(value).toBe(true);
    });
  });

  it('should have keys in correct format (ROLE.route)', () => {
    ROUTE_ACLS.forEach((value, key) => {
      expect(key).toContain('.');
      const parts = key.split('.');
      expect(parts.length).toBeGreaterThanOrEqual(2);
      expect(['ADMIN', 'MANAGER']).toContain(parts[0]);
    });
  });

  it('should have admin and manager access to user profile', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.userProfile;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.userProfile;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
  });

  it('should have admin and manager access to users impact', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.usersImpact;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.usersImpact;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
  });

  it('should have admin and manager access to fountains impact', () => {
    const adminKey = 'ADMIN.' + ROUTER_DEFINITIONS.fountainsImpact;
    const managerKey = 'MANAGER.' + ROUTER_DEFINITIONS.fountainsImpact;
    
    expect(ROUTE_ACLS.has(adminKey)).toBe(true);
    expect(ROUTE_ACLS.has(managerKey)).toBe(true);
  });
});
