import { Injectable } from '@angular/core';
import { AuthService, CookieStorage } from '@tyris/angular-foundation';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../custom-gnommo-base/services';


// CHANGE THIS

@Injectable()
export class LoggedUserService {
    // tslint:disable-next-line:max-line-length
    private _loggedUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private cookieStorage: CookieStorage) {
    }

    getLoggedUserValue(): any {
        return this._loggedUser.getValue();
    }

    getLoggedUser(): Observable<any> {
        return this._loggedUser.asObservable();
    }

    getRole() {
        const userLogged = this._loggedUser.getValue();
        const userCookie = this.cookieStorage.get('user');
        let user;
        let role = null;

        if (userLogged) {
            role = userLogged.role;
        } else {
            if (typeof userCookie === 'object') {
                user = userCookie;
            } else if (typeof userCookie === 'string') {
                user = JSON.parse(userCookie);
            }
            if (user && user.role) {
                role = user.role;
            } else {
                role = null;
            }
        }
        return role;
    }

    getCorporateId() {
        const userLogged = this._loggedUser.getValue();
        const userCookie = this.cookieStorage.get('user');
        let user;
        let corporateId = null;

        if (userLogged) {
            corporateId = userLogged.corporateId;
        } else {
            if (typeof userCookie === 'object') {
                user = userCookie;
            } else if (typeof userCookie === 'string') {
                user = JSON.parse(userCookie);
            }
            if (user && user.corporateId) {
                corporateId = user.corporateId;
            } else {
                corporateId = null;
            }
        }
        return corporateId;
    }

    setLoggedUser(user) {
        if (user) {
            this.cookieStorage.set('user', JSON.stringify(user), this.authService.expiresTime());
            this._loggedUser.next(user);

        }
    }

    logout() {
        this.cookieStorage.remove('user');
        this.authService.removeToken();
        this.setLoggedUser(null);
    }

    checkLoggedUser() {
        if (this.authService.getToken().id) {
            this.userService
                .getCurrentUser(this.authService.getToken().id)
                .subscribe(response => {
                    const userCookie = this.cookieStorage.get('user') as any;
                    let userResponse = response

                    if (userCookie?.role === "ADMIN") {
                        userResponse.isAdmin = true
                    } else if (userCookie?.role === "MANAGER" && userCookie?.isAdmin) {
                        userResponse = userCookie
                    } else {
                        userResponse.isAdmin = false
                    }

                    this.setLoggedUser(userResponse);
                },
                    error => {
                        this.logout();
                    });
        } else {
            this.logout();

        }
    }

    isAuthenticated(): boolean {
        if (this.authService.getToken().id) {
            return true;
        } else {
            return false;
        }
    }
}
