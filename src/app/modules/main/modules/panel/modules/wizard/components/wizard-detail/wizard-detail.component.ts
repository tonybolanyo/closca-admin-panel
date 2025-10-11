import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@tyris/angular-foundation';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { CorporateService, OnboardingService } from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  selector: 'app-wizard-detail',
  templateUrl: './wizard-detail.component.html',
  styleUrls: ['./wizard-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WizardDetailComponent implements OnInit {
  action: string;
  onboardingId: string;
  wizardForm: UntypedFormGroup;
  onboarding;

  corporates;

  editorConfig: AngularEditorConfig;

  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  // Uploader
  public iconUploader: FileUploader = new FileUploader({ url: '' });
  public imageUploader: FileUploader = new FileUploader({ url: '' });

  @ViewChild('iconUploaderInput') iconUploaderInput: ElementRef;
  @ViewChild('imageUploaderInput') imageUploaderInput: ElementRef;


  // IMAGES
  iconId: string;
  imageId: string;
  isIconDeleted = false;
  isImageDeleted = false;

  // LOCAL IMAGES
  isIconLocalChanged = false;
  isImageLocalChanged = false;
  iconLocal = '';
  imageLocal = '';

  role;
  corporateId;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private onboardingService: OnboardingService,
    private corporateService: CorporateService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private ngxLoader: NgxUiLoaderService,
    private authService: AuthService,
    private _location: Location,
    private loggedUserService: LoggedUserService,
    private dialog: MatDialog
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId();

    this.action = this.activatedRoute.snapshot.url[0].path;
    this.onboardingId = this.activatedRoute.snapshot.params['id'];

    this.editorConfig = {
      editable: this.action !== 'view',
      spellcheck: true,
      height: '15rem',
      minHeight: '15rem',
      placeholder: 'Descripción',
      defaultFontName: 'Arial'
    };

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getOnboardingsById();
        this.getCorporates();
        break;

      case 'edit':
        this.buildForm(false);
        this.getOnboardingsById();
        this.getCorporates();
        break;

      case 'new':
        this.buildForm(false);
        this.getCorporates();
        break;
    }
  }

  ngOnInit() {
    this.handlerUploaders();
  }

  handlerUploaders() {
    this.iconUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'wizard_icon_' + new Date().getTime() + fileExtension;

      if (this.iconUploader.queue.length > 1) {
        this.iconUploader.queue.splice(0, 1);
      }
    };

    this.iconUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.imageUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'wizard_image_' + new Date().getTime() + fileExtension;

      if (this.imageUploader.queue.length > 1) {
        this.imageUploader.queue.splice(0, 1);
      }
    };

    this.imageUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  navigateBack() {
    this._location.back();
  }

  buildForm(disabled) {
    this.wizardForm = this.formBuilder.group({
      title: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      description: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        code: [{ value: null, disabled: true }]
      }),
    });
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.corporates = [];
        if (response !== null) {
          this.corporates = response;

          let closcaCorporateIndex = this.corporates.findIndex(corporate => corporate.code === "CLOSCA")
          if (closcaCorporateIndex > -1) {
            this.corporates.splice(closcaCorporateIndex, 1);
          }

        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.wizardForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  getOnboardingsById() {
    this.ngxLoader.start();
    this.onboardingService
      .getById(this.onboardingId)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.onboarding = response;
        this.iconId = this.onboarding.icon;
        this.imageId = this.onboarding.image;
        this.wizardForm.patchValue(response);
      },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un error al obtener la pantalla', 'Error');
        });
  }

  saveForm(values, valid) {
    if (valid) {
      this.isFormSaved = true;

      if (this.role == "MANAGER") {
        values.corporateId = this.corporateId
      } else {
        values.corporateId = values.corporateInfo._id
      }


      if (this.action === 'new') {
        this.createOnboarding(values);
      } else {
        this.updateOnboarding(values);
      }
    }
  }

  corporateChange(event) {
    let corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.wizardForm.controls['corporateInfo'].get('code').setValue(corporateSelected.code);
  }

  checkSpanish() {
    if (this.wizardForm.get('title').get('es').invalid || this.wizardForm.get('description').get('es').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  checkEnglish() {
    if (this.wizardForm.get('title').get('en').invalid || this.wizardForm.get('description').get('en').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  createOnboarding(values) {
    this.ngxLoader.start();
    this.onboardingService
      .create(values)
      .subscribe((response) => {
        this.onboardingId = response._id;
        this.onboardingUploadIcon();
      },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un error al crear la pantalla', 'Error');
        });
  }

  updateOnboarding(values) {
    this.ngxLoader.start();
    this.onboardingService
      .updateOnboarding(this.onboardingId, values)
      .subscribe((response) => {
        this.onboardingUploadIcon();
      },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un error al editar la panalla', 'Error');
        });
  }

  // 1. Upload icon
  onboardingUploadIcon() {
    this.iconUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'onboarding-icons' }
      ]
    });

    if (this.iconUploader.queue.length > 0) {
      this.iconUploader.uploadAll();
    } else {
      this.onboardingUploadImage();
    }

    this.iconUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.onboardingUploadImage(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un problema al actualizar la pantalla',
          'Error'
        );
      }
    };
  }

  // 2. Upload image and assign imgs to onboarding.
  onboardingUploadImage(iconId?) {
    this.imageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'onboarding-images' }
      ]
    });

    if (this.imageUploader.queue.length > 0) {
      this.imageUploader.uploadAll();
    } else {
      this.assignImageToOnboarding(iconId);
    }

    this.imageUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToOnboarding(iconId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un problema al actualizar la pantalla',
          'Error'
        );
      }
    };
  }

  assignImageToOnboarding(iconId?: string, imageId?: string) {

    if (!iconId && !imageId) {
      // No img to assign
      this.ngxLoader.stop();

      this.router.navigate([this.routerDefinitions.wizard, 'list']);
      if (this.action === 'new') {
        this.toastr.success('Pantalla creada con exito', 'Listo');
      } else {
        this.toastr.success('Pantalla actualizada con exito', 'Listo');
      }

    } else {
      // Assign icon / image to onboarding

      let onboardingToAssign;

      if (!iconId && imageId) {
        onboardingToAssign = {
          image: imageId
        };
      } else if (iconId && !imageId) {
        onboardingToAssign = {
          icon: iconId
        };
      } else {
        onboardingToAssign = {
          image: imageId,
          icon: iconId
        };
      }

      this.onboardingService
        .updateOnboarding(this.onboardingId, onboardingToAssign, { 'Accept-language': 'es' })
        .subscribe(
          response => {
            this.ngxLoader.stop();
            this.router.navigate([this.routerDefinitions.wizard, 'list']);

            if (this.action === 'new') {
              this.toastr.success('Pantalla creada con exito', 'Listo');
            } else {
              this.toastr.success('Pantalla actualizada con exito', 'Listo');
            }

          },
          error => {
            this.ngxLoader.stop();

            if (this.action === 'new') {
              this.toastr.error(
                'Ha ocurrido un problema al crear la pantalla',
                'Error'
              );
            } else {
              this.toastr.error(
                'Ha ocurrido un problema al actualizar la pantalla',
                'Error'
              );
            }
            this.router.navigate([this.routerDefinitions.wizard, 'list']);
          }
        );
    }
  }

  changeLocalIcon(event: any) {
    this.wizardForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'png' ||
        fileName.substr(fileName.length - 3) === 'PNG'
      ) {
        this.getBase64(
          event.target.files[event.target.files.length - 1]
        ).then((image: string) => {
          this.isIconLocalChanged = true;
          this.iconLocal = image;
        });
      } else {
        this.iconUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  changeLocalImage(event: any) {
    this.wizardForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'jpg' ||
        fileName.substr(fileName.length - 3) === 'png' ||
        fileName.substr(fileName.length - 4) === 'jpeg' ||
        fileName.substr(fileName.length - 3) === 'PNG' ||
        fileName.substr(fileName.length - 3) === 'JPG' ||
        fileName.substr(fileName.length - 3) === 'JPEG'
      ) {
        this.getBase64(
          event.target.files[event.target.files.length - 1]
        ).then((image: string) => {
          this.isImageLocalChanged = true;
          this.imageLocal = image;
        });
      } else {
        this.imageUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
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

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  showDialogDeleteIcon() {

    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: { message: '¿Está seguro que desea eliminar el icono seleccionado?' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.wizardForm.markAsDirty();
        if (this.iconId) {
          this.iconId = null;
        }

        this.isIconDeleted = true;
        this.isIconLocalChanged = true;
        this.iconLocal = '';

        if (this.iconUploaderInput) {
          this.iconUploaderInput.nativeElement.value = '';
        }

        this.iconUploader.clearQueue();
      }
    });
  }

  showDialogDeleteImage() {

    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: { message: '¿Está seguro que desea eliminar la imagen seleccionada?' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        this.wizardForm.markAsDirty();
        if (this.imageId) {
          this.imageId = null;
        }

        this.isImageDeleted = true;
        this.isImageLocalChanged = true;
        this.imageLocal = '';

        if (this.imageUploaderInput) {
          this.imageUploaderInput.nativeElement.value = '';
        }

        this.imageUploader.clearQueue();
      }
    });
  }

}
