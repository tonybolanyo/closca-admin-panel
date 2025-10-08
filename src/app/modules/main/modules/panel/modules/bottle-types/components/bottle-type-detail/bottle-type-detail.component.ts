import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { BottleTypesService } from 'src/app/shared/custom-gnommo-base/services';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from '@tyris/angular-foundation-libs';
import { S3_URL } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-bottle-type-detail',
  templateUrl: './bottle-type-detail.component.html',
  styleUrls: ['./bottle-type-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BottleTypeDetailComponent implements OnInit {
  action: string;
  bottleTypeId: string;
  bottleTypeForm: FormGroup;
  bottleType;

  // Uploader
  public imageBottleTypeUploader: FileUploader = new FileUploader({ url: '' });

  // --> ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  @ViewChild('imageUploaderInput', { static: false }) imageUploaderInput: ElementRef;

  // IMAGE
  image: string;

  // Local image
  isLocalImageChanged = false;
  localImage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private _location: Location,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private bottleTypesService: BottleTypesService
  ) { 
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.bottleTypeId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getBottleTypeById(this.bottleTypeId);;
        break;
      case 'edit':
        this.buildForm(false);
        this.getBottleTypeById(this.bottleTypeId);
        break;
      case 'new':
        this.buildForm(false);
        break;
    }
  }

  ngOnInit() {
    this.bottleTypeForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
    });
    this.handlerImageBottleTypeUploaders();
  }

  navigateBack() {
    this._location.back();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.bottleTypeForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.bottleTypeForm = this.formBuilder.group({
      name: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      color: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      })
    });
  }

  getBottleTypeById(bottleTypeId: string) {
    this.bottleTypesService
      .getById(bottleTypeId)
      .subscribe(
        (bottleType: any) => {
          this.bottleType = bottleType;
          this.bottleTypeForm.patchValue(bottleType);

          if (bottleType.image) {
            this.image = bottleType.image;
          }

        }
      );
  }

  handlerImageBottleTypeUploaders() {
    this.imageBottleTypeUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'bottle_image_' + new Date().getTime() + fileExtension;

      if (this.imageBottleTypeUploader.queue.length > 1) {
        this.imageBottleTypeUploader.queue.splice(0, 1);
      }
      this.bottleTypeForm.markAsDirty();
    };
    this.imageBottleTypeUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  bottleTypeUploadImage() {
    this.imageBottleTypeUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'bottleTypes' }
      ]
    });

    if (this.imageBottleTypeUploader.queue.length > 0) {
      this.imageBottleTypeUploader.uploadAll();
    } else {
      this.ngxLoader.stop();
      this.router.navigate([this.routerDefinitions.bottleTypes, 'list']);
      this.toastr.success('Tipo de botella actualizado con exito', 'Listo');
    }

    this.imageBottleTypeUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToBottleType(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Corporación no actualizada con exito', 'Error');
      }

    };
  }

  assignImageToBottleType(image: string) {
    let imageToAssign: any = { image: image };
    this.bottleTypesService
      .updateBottleType(this.bottleTypeId, imageToAssign, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.router.navigate([this.routerDefinitions.bottleTypes, 'list']);
        this.toastr.success('Tipo de botella actualizado con exito', 'Listo');
      },
        error => {
          console.log(error);
          this.ngxLoader.stop();
          this.router.navigate([this.routerDefinitions.bottleTypes, 'list']);
          this.toastr.error('Tipo de botella no actualizado con exito', 'Error');
        });
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
          this.createBottleType(values);
          break;

        case 'edit':
          this.updateBottleType(this.bottleTypeId, values);
          break;
      }
    }
  }

  createBottleType(values) {

    if (this.imageBottleTypeUploader.queue.length > 0) {
      this.bottleTypesService
      .create(values, { 'Accept-language': 'es' })
      .subscribe((response) => {

        this.ngxLoader.start();
        this.bottleTypeId = response._id;
        this.bottleType = response;
        this.bottleTypeUploadImage();

      },
        error => {

          this.toastr.error('Ha ocurrido un problema al crear el tipo de botella', 'Error');
        });
    } else {
      this.toastr.error('Debes subir una imagen del tipo de botella', 'Error');
    }
    
  }

  updateBottleType(bottleTypeId: string, values) {
    this.bottleTypesService
      .updateBottleType(bottleTypeId, values, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();
          this.bottleTypeUploadImage();
        },
        error => {
          this.toastr.error('Tipo de botella no actualizado con exito', 'Error');
        }
      );
  }

  changeLocalImage(event: any) {
    this.bottleTypeForm.markAsDirty();
    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
        || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
        || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {
        this.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
          this.isLocalImageChanged = true;
          this.localImage = image;

        });
      } else {
        this.imageBottleTypeUploader.clearQueue();
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
  
}
