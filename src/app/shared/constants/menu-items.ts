import { MenuItem } from '../interfaces/menu-item.interface';
import { ROUTER_DEFINITIONS } from './router-definitions';

export const ADMIN_MENU_ITEMS: MenuItem[] = [
    { label: 'Inicio', routerLink: ROUTER_DEFINITIONS.home },
    { label: 'Usuarios', routerLink: ROUTER_DEFINITIONS.users },
    { label: 'Niveles', routerLink: ROUTER_DEFINITIONS.levels },
    { label: 'Corporaciones', routerLink: ROUTER_DEFINITIONS.corporates },
    { label: 'Wizards', routerLink: ROUTER_DEFINITIONS.wizard },
    { label: 'Fuentes publicas/privadas', routerLink: ROUTER_DEFINITIONS.publicOrPrivateFountains },
    { label: 'Fuentes patrocinadas', routerLink: ROUTER_DEFINITIONS.sponsoredFountains },
    { label: 'Botellas', routerLink: ROUTER_DEFINITIONS.bottles },
    { label: 'Tipos botellas', routerLink: ROUTER_DEFINITIONS.bottleTypes },
    { label: 'Marcas', routerLink: ROUTER_DEFINITIONS.brands },
    { label: 'Retos', routerLink: ROUTER_DEFINITIONS.challenges },
    { label: 'Reportes', routerLink: ROUTER_DEFINITIONS.reports },
    { label: 'Productos', routerLink: ROUTER_DEFINITIONS.products },
    { label: 'Tipos producto', routerLink: ROUTER_DEFINITIONS.productTypes },
    { label: 'Valoraciones', routerLink: ROUTER_DEFINITIONS.userRate },
    { label: 'Imágenes aleatorias para fuentes', routerLink: ROUTER_DEFINITIONS.randomImages },
    { label: 'Impacto usuarios', routerLink: ROUTER_DEFINITIONS.usersImpact },
    { label: 'Impacto fuentes', routerLink: ROUTER_DEFINITIONS.fountainsImpact }
];
export const MANAGER_MENU_ITEMS: MenuItem[] = [
    { label: 'Inicio', routerLink: ROUTER_DEFINITIONS.home },
    { label: 'Wizard', routerLink: ROUTER_DEFINITIONS.wizard },
    { label: 'Usuarios', routerLink: ROUTER_DEFINITIONS.users },
    { label: 'Fuentes corporación', routerLink: ROUTER_DEFINITIONS.sponsoredFountains },
    { label: 'Retos', routerLink: ROUTER_DEFINITIONS.challenges },
    { label: 'Productos', routerLink: ROUTER_DEFINITIONS.products },
    { label: 'Impacto usuarios', routerLink: ROUTER_DEFINITIONS.usersImpact },
    { label: 'Impacto fuentes', routerLink: ROUTER_DEFINITIONS.fountainsImpact }
];
export const PROVIDER_MENU_ITEMS: MenuItem[] = [
    { label: 'Inicio', routerLink: ROUTER_DEFINITIONS.home },
    { label: 'Usuarios', routerLink: ROUTER_DEFINITIONS.users },
];
export const USER_MENU_ITEMS: MenuItem[] = [
    { label: 'Inicio', routerLink: ROUTER_DEFINITIONS.home },
    // { label: 'Usuarios', routerLink: ROUTER_DEFINITIONS.users },
];

export const MENU_ITEMS: MenuItem[] = [
    { label: 'Inicio', routerLink: ROUTER_DEFINITIONS.home },
];
