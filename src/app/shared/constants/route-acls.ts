import { ROUTER_DEFINITIONS } from './router-definitions';



export const ROUTE_ACLS: Map<string, boolean> = new Map([

    // --> Route: /admin/panel/home
    ['ADMIN.' + ROUTER_DEFINITIONS.home, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.home, true],
    // --> Route: /admin/panel/wizard
    ['ADMIN.' + ROUTER_DEFINITIONS.wizard, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.wizard, true],
    // --> Route: /admin/panel/users
    ['ADMIN.' + ROUTER_DEFINITIONS.users, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.users, true],
    // --> Route: /admin/panel/users-impact
    ['ADMIN.' + ROUTER_DEFINITIONS.usersImpact, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.usersImpact, true],
    // --> Route: /admin/panel/fountains-impact
    ['ADMIN.' + ROUTER_DEFINITIONS.fountainsImpact, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.fountainsImpact, true],
    // --> Route: /admin/panel/levels
    ['ADMIN.' + ROUTER_DEFINITIONS.levels, true],
    // --> Route: /admin/panel/public-or-private-fountains
    ['ADMIN.' + ROUTER_DEFINITIONS.publicOrPrivateFountains, true],
    // --> Route: /admin/panel/corporates
    ['ADMIN.' + ROUTER_DEFINITIONS.corporates, true],
    // --> Route: /admin/panel/sponsored-fountains
    ['ADMIN.' + ROUTER_DEFINITIONS.sponsoredFountains, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.sponsoredFountains, true],
    // --> Route: /admin/panel/bottle-types
    ['ADMIN.' + ROUTER_DEFINITIONS.bottleTypes, true],
    // --> Route: /admin/panel/bottles
    ['ADMIN.' + ROUTER_DEFINITIONS.bottles, true],
    // --> Route: /admin/panel/brands
    ['ADMIN.' + ROUTER_DEFINITIONS.brands, true],
    // --> Route: /admin/panel/reports
    ['ADMIN.' + ROUTER_DEFINITIONS.reports, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.reports, true],
    // --> Route: /admin/user-profile
    ['ADMIN.' + ROUTER_DEFINITIONS.userProfile, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.userProfile, true],
    // --> Route: /admin/challenges
    ['ADMIN.' + ROUTER_DEFINITIONS.challenges, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.challenges, true],
    // --> Route: /admin/products
    ['ADMIN.' + ROUTER_DEFINITIONS.products, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.products, true],
    // --> Route: /admin/product-types
    ['ADMIN.' + ROUTER_DEFINITIONS.productTypes, true],
    ['MANAGER.' + ROUTER_DEFINITIONS.productTypes, true],
    // --> Route: /admin/user-rate
    ['ADMIN.' + ROUTER_DEFINITIONS.userRate, true],
    // --> Route: /admin/random-fountain-images
    ['ADMIN.' + ROUTER_DEFINITIONS.randomImages, true],
]);
