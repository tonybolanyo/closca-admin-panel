import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';



@Component({
  standalone: true,
    imports: [RouterModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatCardModule],
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RegisterComponent implements OnInit {
    routerDefinitions = ROUTER_DEFINITIONS;
    userDataForm: UntypedFormGroup;


    constructor(private router: Router,
        private formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private toastr: ToastrService) {
        this.buildForm();
    }

    ngOnInit() {
    }

    register(userFormValues) {
        // Register USER ROLE

        userFormValues.role = 'USER';
        this.userService
            .register(userFormValues)
            .subscribe(
                (createdUser) => {
                    this.toastr.success('Registro realizado correctamente', 'Listo');
                    this.router.navigate([this.routerDefinitions.login]);
                },
                error => {
                    this.toastr.error('Ha ocurrido un error en el registro, intentelo de nuevo', 'Error');
                }
            );
    }

    buildForm() {
        this.userDataForm = this.formBuilder.group({
            realName: [{ value: null, disabled: false }, [Validators.required]],
            email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
            phoneNumber: [{ value: null, disabled: false }, [Validators.required]],
            password: [{ value: null, disabled: false }, [Validators.required]],
        });
    }
}


