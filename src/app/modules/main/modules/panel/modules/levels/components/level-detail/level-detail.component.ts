import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@tyris/angular-foundation';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { LevelService } from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html',
  styleUrls: ['./level-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LevelDetailComponent implements OnInit {
  action: string;
  levelId: string;
  levelForm: UntypedFormGroup;
  level;

  // --> ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  editorConfig: AngularEditorConfig;

  // Uploader
  public imageLevelUploader: FileUploader = new FileUploader({ url: '' });

  // IMAGE
  levelImageId: string;
  isLevelImageDeleted = false;
  @ViewChild('levelImageUploaderInput') imageLevelUploaderInput: ElementRef;

  // Local image
  isLevelLocalImageChanged = false;
  levelLocalImage = '';

  isFormSaved = false;
  isFormCanceled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private _location: Location,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: UntypedFormBuilder,
    private levelService: LevelService,
    private dialog: MatDialog,
  ) {
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.levelId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'edit':
        this.buildForm(false);
        this.getLevelById(this.levelId);
        break;
      case 'view':
        this.buildForm(true);
        this.getLevelById(this.levelId);
        break;
      case 'new':
        this.buildForm(false);
        break;
    }
  }

  ngOnInit() {
    this.levelForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
    });

    this.handlerUploaders();
  }

  handlerUploaders() {
    this.imageLevelUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'level_image_' + new Date().getTime() + fileExtension;

      if (this.imageLevelUploader.queue.length > 1) {
        this.imageLevelUploader.queue.splice(0, 1);
      }
    };

    this.imageLevelUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  navigateBack() {
    this._location.back();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.levelForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.levelForm = this.formBuilder.group({
      code: [{ value: null, disabled: disabled }, Validators.required],
      name: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      description: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, [Validators.required]],
        en: [{ value: null, disabled: disabled }, [Validators.required]]
      }),
      status: [{ value: null, disabled: disabled }, [Validators.required]],
      badger: [{ value: null, disabled: disabled }],
      minRefills: [{ value: null, disabled: disabled }, [Validators.required]],
      maxRefills: [{ value: null, disabled: disabled }, [Validators.required]],
      refillReward: [{ value: null, disabled: disabled }, [Validators.required]],
      fountainCreationReward: [{ value: null, disabled: disabled }, [Validators.required]],
      totalUsers: [{ value: 0, disabled: true }],
      isDefault: [{ value: false, disabled: disabled }],
    });
  }

  getLevelById(levelId: string) {
    this.levelService
      .getById(levelId, { "Accept-language": "es" })
      .subscribe(
        (level: any) => {
          this.level = level;

          this.levelImageId = level.badger;

          if (this.level.minRefills == undefined) {
            this.level.minRefills = 0
          }

          this.levelForm.patchValue(level);
        }
      );
  }

  checkSpanish() {
    // Check for any invalid spanish controls
    if (this.levelForm.get('name').get('es').invalid) {
      return '*';
    } else if (this.levelForm.get('description').get('es').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  checkEnglish() {
    // Check for any invalid english controls
    if (this.levelForm.get('name').get('en').invalid) {
      return '*';
    } else if (this.levelForm.get('description').get('en').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  // SAVE FORM
  saveForm(values, valid) {

    if (valid) {
      this.isFormSaved = true;

      switch (this.action) {
        case 'new':
          this.createLevel(values);
          break;
        case 'edit':
          this.updateLevel(values);
          break;
      }
    }
  }

  createLevel(values) {
    this.levelService
      .create(values, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();

          this.levelId = response._id;
          this.level = response;
          this.levelUploadImage();

        },
        error => {
          this.toastr.error('Nivel no creado con exito', 'Error');
        }
      );
  }

  updateLevel(values) {
    this.levelService
      .update(this.level._id, values, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();

          this.level = values;
          this.levelUploadImage();
        },
        error => {
          this.toastr.error('Nivel no actualizado con exito', 'Error');
        }
      );
  }

  levelUploadImage() {

    this.imageLevelUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'levels' }
      ]

    });

    if (this.imageLevelUploader.queue.length > 0) {

      this.imageLevelUploader.uploadAll();

    } else {

      this.ngxLoader.stop();
      this.navigateBack();
      this.toastr.success('Nivel actualizado con exito', 'Listo');

    }

    this.imageLevelUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToLevel(this.levelId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar el nivel', 'Error');
      }
    };
  }

  assignImageToLevel(levelId: string, imageId: string) {

    let levelToAssign: any = {
      badger: imageId
    };

    this.levelService
      .update(levelId, levelToAssign, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {

          this.ngxLoader.stop();
          this.navigateBack();

          if (this.action === 'edit') {
            this.toastr.success('Nivel actualizado con exito', 'Listo');
          }
        },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un problema al actualizar el nivel', 'Error');
        });
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

        this.levelForm.markAsDirty();
        if (this.levelImageId) {
          this.levelImageId = null;
        }

        this.isLevelImageDeleted = true;
        this.isLevelLocalImageChanged = true;
        this.levelLocalImage = '';

        if (this.imageLevelUploaderInput) {
          this.imageLevelUploaderInput.nativeElement.value = '';
        }

        this.imageLevelUploader.clearQueue();
      }
    });
  }

  changeLocalImage(event: any) {

    this.levelForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
        || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
        || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {

        this.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {

          this.isLevelLocalImageChanged = true;
          this.levelLocalImage = image;
        });

      } else {

        this.imageLevelUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

}
