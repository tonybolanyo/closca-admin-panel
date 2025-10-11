import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MainComponent implements OnInit, OnDestroy {
    user;
    corporateSelectForm: UntypedFormGroup;
    corporates;
    routerDefinitions = ROUTER_DEFINITIONS;

    constructor(
        private corporateService: CorporateService,
        private loggedUserService: LoggedUserService,
        private router: Router,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: UntypedFormBuilder
    ) {
        this.getCorporates();
        this.buildForm();

        this.loggedUserService
            .getLoggedUser()
            .subscribe(
                (response) => {
                    this.user = response;
                    this.corporateSelectForm.patchValue(this.user);
                }
            );
    }

    ngOnInit() {

    }

    buildForm() {
        this.corporateSelectForm = this.formBuilder.group({
            corporateInfo: this.formBuilder.group({
                _id: [{ value: null, disabled: false }],
                code: [{ value: null, disabled: true }]
            }),
        });
    }

    getCorporates() {
        this.corporateService
            .getAll()
            .subscribe((response) => {
                this.corporates = [];
                if (response !== null) {
                    this.corporates = response;

                }
            },
                (error: Error) => {
                });
    }

    corporateChange(event) {
        this.ngxLoader.start();

        let corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]

        if (corporateSelected.code === "CLOSCA") {
            this.user.role = "ADMIN"
        } else {
            this.user.role = "MANAGER"
        }

        this.user.corporateId = corporateSelected._id
        this.user.corporateInfo = corporateSelected

        this.loggedUserService.setLoggedUser(this.user);
        this.router.navigate([this.routerDefinitions.home]).then(() => {
            this.ngxLoader.stop();
            window.location.reload();
        });
    }

    ngOnDestroy() {
    }
}
