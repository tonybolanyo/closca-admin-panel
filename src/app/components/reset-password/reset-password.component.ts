import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';

@Component({
  standalone: false,
    selector: 'app-reset-password',
    templateUrl: 'reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    resetPasswordForm: UntypedFormGroup;
    routerDefinitions = ROUTER_DEFINITIONS;
    hash;

    constructor(private formBuilder: UntypedFormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService) {
        this.buildResetPasswordForm();
        this.hash = this.activatedRoute.snapshot.queryParams['hash'];
     }

    ngOnInit() { }

    buildResetPasswordForm()  {
        this.resetPasswordForm = this.formBuilder.group({
            password: [{value: null, disabled: false}, [Validators.required]],
            passwordRepeat: [{value: null, disabled: false}, [Validators.required]]
        });
    }

    sendResetPassword(values) {
        if (values.password === values.passwordRepeat) {
            this.userService
            .resetPassword(values.password, decodeURIComponent(this.hash))
            .subscribe(
                (response) => {
                    this.toastr.success('Contraseña cambiada con exito', 'Listo');
                    this.router.navigate([this.routerDefinitions.login]);
                }
            );
        } else {
            this.toastr.error('Las contraseñas no coinciden', 'Error');
        }
    }

    navigateToLogin() {
            this.router.navigate([this.routerDefinitions.login]);
    }
}
