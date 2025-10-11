import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROUTER_DEFINITIONS } from '../../../../shared/constants/router-definitions';
// import { LoggedUserService } from '../../../../shared/services/logged-user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { S3_URL } from 'src/app/shared/constants/constants';
import { User } from 'src/app/shared/custom-gnommo-base/models';
import { UserService } from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
    imports: [RouterModule, ReactiveFormsModule, FormsModule],
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  routerDefinitions = ROUTER_DEFINITIONS;
  proficientId: string;
  signatureImageKey: string;

  public uploader: FileUploader = new FileUploader({ url: '' });

  isLocalImageChanged = false;
  localImage = '';
  user: User;


  transportDocuments = [];
  isFormCanceled = false;
  isFormSaved = false;


  constructor(
    private formBuilder: FormBuilder,
    private loggedUserService: LoggedUserService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private canDeactivateDialogService: CanDeactivateDialogService) {
    this.buildUserForm(false);

  }

  ngOnInit() {
    if (this.loggedUserService.getLoggedUserValue() && this.loggedUserService.getLoggedUserValue()._id) {
      this.user = this.loggedUserService.getLoggedUserValue();
      this.getUser(this.user._id);
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.userForm.dirty) {
        return this.canDeactivateDialogService.openDialog();
    }
    return true;
}

  buildUserForm(disabled: boolean) {
    this.userForm = this.formBuilder.group({
      realName: [{ value: null, disabled: disabled }, [Validators.required]],
      phoneNumber: [{ value: null, disabled: disabled }, [Validators.required]],
      email: [{ value: null, disabled: disabled }, [Validators.required, Validators.email]],
    });
  }

  saveForm(values, isValid) {
    if (isValid) {
      this.isFormSaved = true;
      this.userService
        .update(this.user._id, values)
        .subscribe((response) => {
          this.loggedUserService.setLoggedUser(response);
          this.toastr.success('Tus datos han sido actualizados con exito', 'Listo');
          this.router.navigate([this.routerDefinitions.home]);
        });
    }
  }

  getUser(userId) {
    this.userService
      .getById(userId)
      .subscribe(
        (response) => {
          this.userForm.patchValue(response);
        }
      );
  }




  getBase64(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }


  navigate() {
    this.router.navigate([this.routerDefinitions.home]);
  }
}
