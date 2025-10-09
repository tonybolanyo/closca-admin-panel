import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { CookieStorage } from '@tyris/angular-foundation';
import { ROUTE_ACLS } from '../constants/route-acls';
import { ROUTER_DEFINITIONS } from '../constants/router-definitions';
import { LoggedUserService } from '../services/logged-user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private loggedUserService: LoggedUserService,
        private cookieStorage: CookieStorage
        // private internalStorage: InternalStorage
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkAuthorization(route, state);

    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkAuthorization(route, state);
    }

    checkAuthorization(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const role = this.loggedUserService.getRole();

        if (!this.loggedUserService.isAuthenticated()
            || !this.routeAndRoleBroker(role, state)
        ) {
            this.router.navigate([ROUTER_DEFINITIONS.login]);
            return false;
        }
        return true;
    }
    routeAndRoleBroker(role, route): boolean {
        const routeAndRoleMap = ROUTE_ACLS;
        const routeAndRoleToCheck = role + this.prepareRoute(route.url);
        return routeAndRoleMap.get(routeAndRoleToCheck);
    }

    prepareRoute(routeUrl): string {
        const routeSegments = routeUrl.split('/');
        let route = '';
        if (routeSegments[2] === 'panel') {
            route = './' + routeSegments[1] + '/' + routeSegments[2] + '/' + routeSegments[3];
        } else {
            route = './' + routeSegments[1] + '/' + routeSegments[2];
        }
        return route;
    }

}
