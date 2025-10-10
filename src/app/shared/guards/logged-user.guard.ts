import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';
import { Injectable } from '@angular/core';
import { ROUTER_DEFINITIONS } from '../constants/router-definitions';

@Injectable()
export class LoggedUserGuard implements CanActivate {
    constructor(
        private router: Router,
        private loggedUserService: LoggedUserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loggedUserService.isAuthenticated()) {
            const role = this.loggedUserService.getRole();
            switch (role) {
                case 'USER':
                    this.router.navigate([ROUTER_DEFINITIONS.home]);
                    break;
                case 'PROVIDER':
                    this.router.navigate([ROUTER_DEFINITIONS.home]);
                    break;
                case 'ADMIN':
                    this.router.navigate([ROUTER_DEFINITIONS.home]);
                    break;
                default:
                    this.router.navigate([ROUTER_DEFINITIONS.login]);
                    break;
            }
            return false;
        }
        return true;

    }
}
