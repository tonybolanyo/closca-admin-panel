import { ADMIN_MENU_ITEMS, MANAGER_MENU_ITEMS, PROVIDER_MENU_ITEMS, USER_MENU_ITEMS, MENU_ITEMS } from './menu-items';
import { ROUTER_DEFINITIONS } from './router-definitions';

describe('Menu Items Constants', () => {
  describe('ADMIN_MENU_ITEMS', () => {
    it('should have correct structure', () => {
      expect(ADMIN_MENU_ITEMS).toBeDefined();
      expect(Array.isArray(ADMIN_MENU_ITEMS)).toBe(true);
      expect(ADMIN_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have all required menu items', () => {
      const labels = ADMIN_MENU_ITEMS.map(item => item.label);
      expect(labels).toContain('Inicio');
      expect(labels).toContain('Usuarios');
      expect(labels).toContain('Niveles');
      expect(labels).toContain('Corporaciones');
      expect(labels).toContain('Wizards');
      expect(labels).toContain('Fuentes publicas/privadas');
      expect(labels).toContain('Fuentes patrocinadas');
      expect(labels).toContain('Botellas');
      expect(labels).toContain('Tipos botellas');
      expect(labels).toContain('Marcas');
      expect(labels).toContain('Retos');
      expect(labels).toContain('Reportes');
      expect(labels).toContain('Productos');
      expect(labels).toContain('Tipos producto');
      expect(labels).toContain('Valoraciones');
      expect(labels).toContain('Imágenes aleatorias para fuentes');
      expect(labels).toContain('Impacto usuarios');
      expect(labels).toContain('Impacto fuentes');
    });

    it('should have valid router links', () => {
      ADMIN_MENU_ITEMS.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.routerLink).toBeDefined();
        expect(typeof item.routerLink).toBe('string');
      });
    });

    it('should reference correct router definitions', () => {
      const homeItem = ADMIN_MENU_ITEMS.find(item => item.label === 'Inicio');
      expect(homeItem?.routerLink).toBe(ROUTER_DEFINITIONS.home);

      const usersItem = ADMIN_MENU_ITEMS.find(item => item.label === 'Usuarios');
      expect(usersItem?.routerLink).toBe(ROUTER_DEFINITIONS.users);
    });
  });

  describe('MANAGER_MENU_ITEMS', () => {
    it('should have correct structure', () => {
      expect(MANAGER_MENU_ITEMS).toBeDefined();
      expect(Array.isArray(MANAGER_MENU_ITEMS)).toBe(true);
      expect(MANAGER_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have limited menu items compared to admin', () => {
      expect(MANAGER_MENU_ITEMS.length).toBeLessThan(ADMIN_MENU_ITEMS.length);
    });

    it('should have required manager menu items', () => {
      const labels = MANAGER_MENU_ITEMS.map(item => item.label);
      expect(labels).toContain('Inicio');
      expect(labels).toContain('Wizard');
      expect(labels).toContain('Usuarios');
      expect(labels).toContain('Fuentes corporación');
      expect(labels).toContain('Retos');
      expect(labels).toContain('Productos');
      expect(labels).toContain('Impacto usuarios');
      expect(labels).toContain('Impacto fuentes');
    });

    it('should have valid router links', () => {
      MANAGER_MENU_ITEMS.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.routerLink).toBeDefined();
        expect(typeof item.routerLink).toBe('string');
      });
    });
  });

  describe('PROVIDER_MENU_ITEMS', () => {
    it('should have correct structure', () => {
      expect(PROVIDER_MENU_ITEMS).toBeDefined();
      expect(Array.isArray(PROVIDER_MENU_ITEMS)).toBe(true);
      expect(PROVIDER_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have minimal menu items', () => {
      expect(PROVIDER_MENU_ITEMS.length).toBeLessThan(MANAGER_MENU_ITEMS.length);
    });

    it('should have required provider menu items', () => {
      const labels = PROVIDER_MENU_ITEMS.map(item => item.label);
      expect(labels).toContain('Inicio');
      expect(labels).toContain('Usuarios');
    });

    it('should have valid router links', () => {
      PROVIDER_MENU_ITEMS.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.routerLink).toBeDefined();
        expect(typeof item.routerLink).toBe('string');
      });
    });
  });

  describe('USER_MENU_ITEMS', () => {
    it('should have correct structure', () => {
      expect(USER_MENU_ITEMS).toBeDefined();
      expect(Array.isArray(USER_MENU_ITEMS)).toBe(true);
      expect(USER_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should have minimal menu items', () => {
      const labels = USER_MENU_ITEMS.map(item => item.label);
      expect(labels).toContain('Inicio');
    });

    it('should have valid router links', () => {
      USER_MENU_ITEMS.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.routerLink).toBeDefined();
        expect(typeof item.routerLink).toBe('string');
      });
    });
  });

  describe('MENU_ITEMS', () => {
    it('should have correct structure', () => {
      expect(MENU_ITEMS).toBeDefined();
      expect(Array.isArray(MENU_ITEMS)).toBe(true);
      expect(MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('should contain default menu item', () => {
      const labels = MENU_ITEMS.map(item => item.label);
      expect(labels).toContain('Inicio');
    });

    it('should have valid router links', () => {
      MENU_ITEMS.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.routerLink).toBeDefined();
        expect(typeof item.routerLink).toBe('string');
      });
    });
  });
});
