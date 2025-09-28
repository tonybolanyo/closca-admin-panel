import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { AuthService } from '@tyris/angular-foundation-libs';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { S3_URL } from 'src/app/shared/constants/constants';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { Brand } from 'src/app/shared/custom-gnommo-base/models/brand.model';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.scss']
})
export class BrandDetailComponent implements OnInit {
  action: string;
  brandId;
  brandForm: FormGroup;
  brand;
  fountains;

  // UPLOADERS
  public brandImageUploader: FileUploader = new FileUploader({ url: '' });
  public brandBackgroundImageUploader: FileUploader = new FileUploader({ url: '' });

  // IMAGE
  brandImageId: string;
  isBrandImageDeleted = false;
  @ViewChild('brandImageUploaderInput') brandImageUploaderInput: ElementRef;

  // LOCAL IMAGE
  isBrandLocalImageChanged = false;
  brandLocalImage = '';

  // BACKGROUND IMAGE
  brandBackgroundImageId: string;
  isBrandBackgroundImageDeleted = false;
  @ViewChild('brandBackgroundImageUploaderInput') brandBackgroundImageUploaderInput: ElementRef;

  // LOCAL BACKGROUND IMAGE
  isBrandLocalBackgroundImageChanged = false;
  brandLocalBackgroundImage = '';

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // ROUTES
  private previousUrl: string;
  private currentUrl: string;

  isFormSaved = false;
  isFormCanceled = false;

  // CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: false,
    buttonsConfig: {
      validateButton: true,
      viewButton: true,
      editButton: false,
      newButton: false,
      deleteButton: false,
      baseRouterLink: this.routerDefinitions.publicOrPrivateFountains
    },
    columns: [
      {
        columnDef: 'name',
        columnValue: 'name',
        columnType: 'STRING',
        headerLabel: 'Nombre',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Nombre',
          formControl: {
            name: 'name'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'fountainType',
        columnValue: 'fountainType',
        columnType: 'STRING',
        headerLabel: 'Tipo',
        filter: {
          exists: false,
          type: 'DROPDOWN',
          placeholder: 'Tipo',
          formControl: {
            name: 'fountainType'
          },
          sortFilterExists: false,
        },
      },
      {
        columnDef: 'fountainAddress',
        headerLabel: 'Dirección',
        columnValue: 'address.address',
        columnType: 'STRING',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Dirección',
          formControl: {
            name: 'fountainAddress'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'fountainStatus',
        headerLabel: 'Estado',
        columnValue: 'fountainStatus',
        columnType: 'STRING',
        filter: {
          exists: false,
          type: 'DROPDOWN',
          placeholder: 'Estado',
          formControl: {
            name: 'fountainStatus'
          },
          sortFilterExists: false,
        },
      },
    ]
  };
  // END CONFIG TABLE

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private brandService: BrandService,
    private fountainService: FountainService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog
  ) {
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.brandId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getBrandById(this.brandId);
        break;
      case 'edit':
        this.buildForm(false);
        this.getBrandById(this.brandId);
        break;
      case 'new':
        this.buildForm(false);
    }
  }

  ngOnInit() {
    this.handlerUploaders();
  }

  handlerUploaders() {
    this.brandImageUploader.onAfterAddingFile = file => {
      const fileExtension = '.' + file.file.name.split('.').pop();
      file.file.name =
        'brand_image_' + new Date().getTime() + fileExtension;

      if (this.brandImageUploader.queue.length > 1) {
        this.brandImageUploader.queue.splice(0, 1);
      }
    };

    this.brandImageUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.brandBackgroundImageUploader.onAfterAddingFile = file => {
      const fileExtension = '.' + file.file.name.split('.').pop();
      file.file.name =
        'brand_background_image_' + new Date().getTime() + fileExtension;

      if (this.brandBackgroundImageUploader.queue.length > 1) {
        this.brandBackgroundImageUploader.queue.splice(0, 1);
      }
    };

    this.brandBackgroundImageUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.brandForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.brandForm = this.formBuilder.group({
      name: [{ value: null, disabled: disabled }, Validators.required],
      twitter: [{ value: null, disabled: disabled }],
      facebook: [{ value: null, disabled: disabled }],
      instagram: [{ value: null, disabled: disabled }],
      linkedin: [{ value: null, disabled: disabled }]
    });
  }

  getBrandById(brandId: string) {
    this.brandService
      .getById(brandId)
      .subscribe(
        (brand: any) => {
          if (brand.fountains) {

            const auxFountains = brand.fountains;

            this.fountains = auxFountains.filter(fountain => fountain.fountainStatus !== 'DELETED');

            this.fountains.forEach(element => {

              element.fountainType = this.changeFountainTypeName(element.fountainType);
              element.fountainStatus = this.changeFountainStatusName(element.fountainStatus);
            });
          }

          this.brand = brand;
          this.brandImageId = brand.imageId;
          this.brandBackgroundImageId = brand.backgroundId;
          this.brandForm.patchValue(brand);
        });
  }

  saveForm(values, valid) {
    if (valid) {

      switch (this.action) {
        case 'new':
          this.isFormSaved = true;
          this.createBrand(values);
          break;
        case 'edit':
          this.isFormSaved = true;
          this.updateBrand(this.brandId, values);
      }
    }
  }

  createBrand(values) {
    this.brandService
      .create(values)
      .subscribe((response) => {
        this.brandId = response._id;
        this.ngxLoader.start();
        this.brandUploadBackgroundImage();
      },
        error => {
          this.toastr.error('Ha ocurrido un problema al crear la marca', 'Error');
        });
  }

  updateBrand(brandId: string, values) {
    this.brandService
      .update(brandId, values, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.ngxLoader.start();
        this.brandUploadBackgroundImage();
      },
        error => {
          this.toastr.error('Ha ocurrido un problema al actualizar la marca', 'Error');
        });
  }



  // 1. Upload background img
  brandUploadBackgroundImage() {
    this.brandBackgroundImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'background-brands' }
      ]
    });

    if (this.brandBackgroundImageUploader.queue.length > 0) {
      this.brandBackgroundImageUploader.uploadAll();
    } else {
      this.brandUploadImage();
    }

    this.brandBackgroundImageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.brandUploadImage(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la marca', 'Error');
      }
    };
  }


  // 2. Upload brand img and assign img to users.

  brandUploadImage(backgroundImageId?) {
    this.brandImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'brands' }
      ]
    });

    if (this.brandImageUploader.queue.length > 0) {
      this.brandImageUploader.uploadAll();
    } else {
      this.assignImageToBrand(backgroundImageId);
    }

    this.brandImageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToBrand(backgroundImageId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la marca', 'Error');
      }

    };
  }

  assignImageToBrand(backgroundId?: string, imageId?: string) {
    let imagesToAssign: any = {};

    if (!backgroundId && !imageId) {
      // No img to assign 
      this.ngxLoader.stop();
      this.router.navigate([this.routerDefinitions.brands, 'list']);
      if (this.action === 'new') {
        this.toastr.success('Marca creada con exito', 'Listo');
      } else {
        this.toastr.success('Marca actualizada con exito', 'Listo');
      }
    } else {
      // Assign brandImg / backgroundImg to brand

      if (!backgroundId && imageId) {
        imagesToAssign = { imageId: imageId };

      } else if (backgroundId && !imageId) {
        imagesToAssign = { backgroundId: backgroundId };

      } else {
        imagesToAssign = { imageId: imageId, backgroundId: backgroundId };
      }

      this.brandService
        .update(this.brandId, imagesToAssign, { 'Accept-language': 'es' })
        .subscribe(
          (response) => {

            this.ngxLoader.stop();
            this.router.navigate([this.routerDefinitions.brands, 'list']);
            if (this.action === 'new') {
              this.toastr.success('Marca creada con exito', 'Listo');
            } else {
              this.toastr.success('Marca actualizada con exito', 'Listo');
            }

          },
          error => {
            this.ngxLoader.stop();

            if (this.action === 'new') {
              this.toastr.error('Ha ocurrido un problema al crear la marca', 'Error');
            } else {
              this.toastr.error('Ha ocurrido un problema al actualizar la marca', 'Error');
            }
            this.router.navigate([this.routerDefinitions.brands, 'list']);
          });

    }

  }

  changeLocalImage(event: any, type: string) {
    const self: BrandDetailComponent = this;
    this.brandForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
        || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
        || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {
        const img = new Image();

        img.src = window.URL.createObjectURL(event.target.files[event.target.files.length - 1]);
        img.onload = function () {

          // start onLoad Img
          let width, height = 0;
          width = img.naturalWidth;
          height = img.naturalHeight;


          // Start background image
          if (type === 'background') {

            if (width <= 969 && height <= 1458) {
              self.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
                self.isBrandLocalBackgroundImageChanged = true;
                self.brandLocalBackgroundImage = image;
              });

            } else {
              self.brandBackgroundImageUploader.clearQueue();
              self.brandBackgroundImageUploaderInput.nativeElement.value = '';
              self.toastr.error('El tamaño excede del máximo permitido (969x1458px)', 'Error');
            }

            // End background image
          } else {

            // Start brand image
            if (width <= 93 && height <= 93) {

              self.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
                self.isBrandLocalImageChanged = true;
                self.brandLocalImage = image;
              });

            } else {

              self.brandImageUploader.clearQueue();
              self.brandImageUploaderInput.nativeElement.value = '';
              self.toastr.error('El tamaño excede del máximo permitido (93x93px)', 'Error');
            }
            // End brand image
          }
        };
      } else {

        if (type === 'background') {
          this.brandBackgroundImageUploader.clearQueue();
          this.toastr.error('El formato del archivo no es compatible', 'Error');

        } else {

          this.brandImageUploader.clearQueue();
          this.toastr.error('El formato del archivo no es compatible', 'Error');
        }
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

  showDialogDeleteImage(type) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: { message: '¿Está seguro que desea eliminar la imagen seleccionada?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // Start background image
        if (type === 'background') {

          this.brandForm.markAsDirty();

          if (this.brandBackgroundImageId) {
            this.brandBackgroundImageId = null;
          }

          this.isBrandBackgroundImageDeleted = true;
          this.isBrandLocalBackgroundImageChanged = true;
          this.brandLocalBackgroundImage = '';
          if (this.brandBackgroundImageUploaderInput) {
            this.brandBackgroundImageUploaderInput.nativeElement.value = '';
          }
          this.brandBackgroundImageUploader.clearQueue();
          // End background image

        } else {

          // Start brand image
          this.brandForm.markAsDirty();

          if (this.brandImageId) {
            this.brandImageId = null;
          }

          this.isBrandImageDeleted = true;
          this.isBrandLocalImageChanged = true;
          this.brandLocalImage = '';
          if (this.brandImageUploaderInput) {
            this.brandImageUploaderInput.nativeElement.value = '';
          }
          this.brandImageUploader.clearQueue();
          // End brand image
        }


      }
    });
  }

  changeFountainTypeName(fountainType: any) {
    let result;
    switch (fountainType) {
      case 'PUBLIC':
        result = 'Publica';
        break;
      case 'RESTAURANT':
        result = 'Restaurante';
        break;
      case 'CAFE_BAR':
        result = 'Cafe bar';
        break;
      case 'HOTEL_HOSTEL':
        result = 'Hotel / Hostal';
        break;
      case 'SHOP':
        result = 'Tienda';
        break;
      case 'BANK':
        result = 'Banco';
        break;
      case 'OTHERS':
        result = 'Otro';
        break;
      case 'SPONSORED':
        result = 'Patrocinada';
        break;
      default:
        result = '';
        break;
    }
    return result;
  }

  changeFountainStatusName(fountainStatus: any) {
    let result;
    switch (fountainStatus) {
      case 'ACTIVE':
        result = 'Activa';
        break;
      case 'INACTIVE':
        result = 'Inactiva';
        break;
      case 'PENDING':
        result = 'Pendiente';
    }
    return result;
  }

}
