import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTER_DEFINITIONS } from '../../shared/constants/router-definitions';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';

@Component({
    selector: 'app-password-recover',
    templateUrl: 'password-recover.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./password-recover.component.scss']
})

export class PasswordRecoverComponent implements OnInit {
    passwordRecoverForm: FormGroup;
    passwordRecoverType: string;
    routerDefinitions = ROUTER_DEFINITIONS;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private activateRoute: ActivatedRoute,
        private userService: UserService) {
        this.buildPasswordRecoverForm();
    }

    ngOnInit() { }

    buildPasswordRecoverForm() {
        this.passwordRecoverForm = this.formBuilder.group({
            email: [{ value: null, disabled: false }, [Validators.required, Validators.email]]
        });
    }

    sendPasswordRecover(values)  {
        this.userService
        .passwordRecovery(values.email).subscribe(
                (response) => {
                    this.toastr.success('Se ha enviado un mensaje a su correo electrónico', 'Listo');
                    this.navigateToLogin();
                },
                (error) => {
                    if (error.statusCode === 404)  {
                        this.toastr.error('Este correo no se ha encontrado', 'Error');
                    } else {
                        this.toastr.error('Se ha producido un error al enviar el mensaje a su correo', 'Error');
                    }
                }
            );
    }

    navigateToLogin() {
        this.router.navigate([this.routerDefinitions.login]);
    }
}
