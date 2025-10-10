import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
// import { LoggedUserService } from '../../shared/services/logged-user.service';
import { AuthService, CookieStorage } from '@tyris/angular-foundation';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';

@Component({
  standalone: false,
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
    loginForm: UntypedFormGroup;
    loginType;
    loginSubscription: Subscription;
    hasLoginType: boolean;
    routerDefinitions = ROUTER_DEFINITIONS;
    constructor(
        private formBuilder: UntypedFormBuilder,
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
