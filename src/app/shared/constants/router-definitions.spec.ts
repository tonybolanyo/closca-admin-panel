import { ROUTER_DEFINITIONS } from './router-definitions';

describe('Router Definitions Constants', () => {
  it('should export ROUTER_DEFINITIONS object', () => {
    expect(ROUTER_DEFINITIONS).toBeDefined();
    expect(typeof ROUTER_DEFINITIONS).toBe('object');
  });

  it('should have login route defined', () => {
    expect(ROUTER_DEFINITIONS.login).toBe('/login');
  });

  it('should have home route defined', () => {
    expect(ROUTER_DEFINITIONS.home).toBe('/admin/panel/home');
  });

  it('should have all authentication routes', () => {
    expect(ROUTER_DEFINITIONS.passwordRecover).toBe('/password-recover');
    expect(ROUTER_DEFINITIONS.resetPassword).toBe('/reset-password');
    expect(ROUTER_DEFINITIONS.register).toBe('/register');
  });

  it('should have admin panel routes', () => {
    expect(ROUTER_DEFINITIONS.users).toBe('/admin/panel/users');
    expect(ROUTER_DEFINITIONS.corporates).toBe('/admin/panel/corporates');
    expect(ROUTER_DEFINITIONS.brands).toBe('/admin/panel/brands');
    expect(ROUTER_DEFINITIONS.products).toBe('/admin/panel/products');
  });

  it('should have fountain-related routes', () => {
    expect(ROUTER_DEFINITIONS.publicOrPrivateFountains).toBe('/admin/panel/public-or-private-fountains');
    expect(ROUTER_DEFINITIONS.sponsoredFountains).toBe('/admin/panel/sponsored-fountains');
    expect(ROUTER_DEFINITIONS.fountainsImpact).toBe('/admin/panel/fountains-impact');
  });

  it('should have bottle-related routes', () => {
    expect(ROUTER_DEFINITIONS.bottles).toBe('/admin/panel/bottles');
    expect(ROUTER_DEFINITIONS.bottleTypes).toBe('/admin/panel/bottle-types');
  });

  it('should have all required routes defined', () => {
    const expectedRoutes = [
      'login', 'passwordRecover', 'resetPassword', 'register', 'userProfile',
      'home', 'wizard', 'crud', 'users', 'usersImpact', 'levels',
      'fountainsImpact', 'publicOrPrivateFountains', 'corporates',
      'sponsoredFountains', 'bottleTypes', 'bottles', 'brands', 'reports',
      'challenges', 'products', 'productTypes', 'userRate', 'randomImages'
    ];

    expectedRoutes.forEach(route => {
      expect(ROUTER_DEFINITIONS[route]).toBeDefined();
      expect(typeof ROUTER_DEFINITIONS[route]).toBe('string');
    });
  });
});