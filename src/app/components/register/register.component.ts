import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Router } from '@angular/router';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { AuthService } from '@gnommostudios/ng-gnommo-base';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { User } from 'src/app/shared/custom-gnommo-base/models';



@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RegisterComponent implements OnInit {
    routerDefinitions = ROUTER_DEFINITIONS;
    userDataForm: FormGroup;


    constructor(private router: Router,
        private formBuilder: FormBuilder,
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


