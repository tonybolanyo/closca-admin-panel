import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// import { LoggedUserService } from '../../shared/services/logged-user.service';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { AuthService, CookieStorage } from '@gnommostudios/ng-gnommo-base';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginType;
    loginSubscription: Subscription;
    hasLoginType: boolean;
    routerDefinitions = ROUTER_DEFINITIONS;
    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private userService: UserService,
        private loggedUserService: LoggedUserService,
        private authService: AuthService,
        private cookieStorage: CookieStorage,
    ) { }

    ngOnInit() {
        document.documentElement.style.removeProperty(`--corporate-primary`);
        this.buildLoginForm();
    }


    buildLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
            password: [{ value: null, disabled: false }, [Validators.required]]
        });
    }

    sendLogin(values) {
        this.sendLoginUser(values);
    }




    sendLoginUser(values) {
        this.userService
            .login(values, { 'Accept-language': 'es' })
            .subscribe(
                (response) => {
                    this.authService.setToken(response.token);
                    this.userService
                        .getCurrentUser(response.token)
                        .subscribe(
                            (user) => {
                                if (user.role === 'ADMIN' || user.role === 'MANAGER') {
                                    user.isAdmin = user.role === 'ADMIN'
                                    this.loggedUserService.setLoggedUser(user);
                                    this.router.navigate([this.routerDefinitions.home]);
                                } else {
                                    this.loggedUserService.logout();
                                    this.toastr.error('Solo pueden iniciar sesión los administradores', 'Fallo inicio de sesión');
                                }

                            }
                        );
                },
                (error: any) => {
                    this.toastr.error(error.error.error, 'Fallo inicio de sesión');

                }
            );
    }

    passwordRecover() {
        this.router.navigate([this.routerDefinitions.passwordRecover]);
    }
}
