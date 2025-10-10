import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@tyris/angular-foundation';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime } from 'rxjs/operators';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { FOUNTAIN_STATUSES } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Brand } from 'src/app/shared/custom-gnommo-base/models/brand.model';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { Fountain } from 'src/app/shared/custom-gnommo-base/models/fountain.model';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { LoggedUserService } from 'src/app/shared/services/logged-user.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-sponsored-fountain-create',
  templateUrl: './sponsored-fountain-create.component.html',
  styleUrls: ['./sponsored-fountain-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SponsoredFountainCreateComponent implements OnInit {
  fountainId: string = null;
  fountainForm: UntypedFormGroup;
  corporates;

  privateFountains;
  brandsList;

  filter: any = {};

  // UPLOADERS
  public mapPinImageUploader: FileUploader = new FileUploader({ url: '' });
  public fountainImageUploader: FileUploader = new FileUploader({ url: '' });

  // ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  // IMAGES
  mapPinImageId: string;
  isMapPinImageDeleted = false;
  fountainImageId: string;
  isFountainImageDeleted = false;

  @ViewChild('mapPinImageUploaderInput') mapPinImageUploaderInput: ElementRef;
  @ViewChild('fountainImageUploaderInput') fountainImageUploaderInput: ElementRef;

  // LOCAL IMAGES
  mapPinLocalImage = '';
  fountainLocalImage = '';
  isFountainLocalImageChanged = false;
  isMapPinLocalImageChanged = false;

  currentUser;

  // END IMAGES


  displayedColumns: string[] = ['title', 'type', 'address', 'status', 'corporate'];

  // PAGINATOR

  paginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };


  fountainTypes = [...[{ name: 'Todos', value: '' }], ...[
    { name: 'Restaurante', value: 'RESTAURANT' },
    { name: 'Cafe bar', value: 'CAFE_BAR' },
    { name: 'Hotel / Hostal', value: 'HOTEL_HOSTEL' },
    { name: 'Tienda', value: 'SHOP' },
    { name: 'Banco', value: 'BANK' },
    { name: 'Otro', value: 'OTHERS' }
  ]];

  fountainStatus = [...[{ name: 'Todos', value: '' }], ...FOUNTAIN_STATUSES];


  filterForm: UntypedFormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private fountainService: FountainService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService,
    private brandService: BrandService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.buildForm(false);
    this.filter = `{"fountainType": { $nin: [ "PUBLIC", "SPONSORED" ] }, "fountainStatus": { $ne: "DELETED"}}`;
    this.getCorporates();
    this.getFountains();
    this.getBrands();
    this.countFountains();

    this.filterForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
      this.createFilter(values);
      this.resetPaginate();
      this.countFountains();
    });

  }

  ngOnInit() {
    this.handlerUploaders();
    this.loggedUserService
      .getLoggedUser()
      .subscribe((response) => {
        this.currentUser = response;
      });

  }

  handlerUploaders() {
    this.mapPinImageUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'map_pin_' + new Date().getTime() + fileExtension;

      if (this.mapPinImageUploader.queue.length > 1) {
        this.mapPinImageUploader.queue.splice(0, 1);
      }
    };

    this.mapPinImageUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.mapPinImageUploader.onWhenAddingFileFailed = (item) => {
      this.mapPinLocalImage = '';
      this.mapPinImageUploaderInput.nativeElement.value = '';
      this.isMapPinImageDeleted = true;
      this.mapPinImageUploader.clearQueue();
      this.toastr.error('La imagen es demasiado grande', 'Error');
    };

    this.fountainImageUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'fountain_image_' + new Date().getTime() + fileExtension;

      if (this.fountainImageUploader.queue.length > 1) {
        this.fountainImageUploader.queue.splice(0, 1);
      }
    };

    this.fountainImageUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.fountainImageUploader.onWhenAddingFileFailed = (item) => {
      this.fountainLocalImage = '';
      this.fountainImageUploaderInput.nativeElement.value = '';
      this.isFountainImageDeleted = true;
      this.fountainImageUploader.clearQueue();
      this.toastr.error('La imagen es demasiado grande', 'Error');
    };
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        if (response !== null) {
          this.corporates = response;
          this.corporates.unshift(new Corporate("", "Todas"));

          // this.setupTableConfig();
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  buildForm(disabled) {
    this.fountainForm = this.formBuilder.group({
      brandInfo: [{ value: null, disabled: disabled }, [Validators.required]]
    });

    this.filterForm = this.formBuilder.group({
      name: [],
      fountainType: [],
      address: [],
      fountainStatus: [],
      corporateId: []
    });
  }

  saveForm(values, valid) {
    if (valid) {
      this.isFormSaved = true;
      this.createSponsoredFountain(this.fountainId, values);
    }
  }

  assignImageToFountain(mapPinImageId?: string, fountainImageId?: string) {
    let imagesToAssign: any = {};

    // If (exists) upload else send list
    if (!mapPinImageId && !fountainImageId) {
      this.ngxLoader.stop();
      this.router.navigate([this.routerDefinitions.sponsoredFountains, 'list']);
      this.toastr.success('Fuente actualizada con exito', 'Listo');
    } else {
      if (!mapPinImageId && fountainImageId) {
        imagesToAssign = { imageId: fountainImageId };

      } else if (mapPinImageId && !fountainImageId) {
        imagesToAssign = { mapPinImageId: mapPinImageId };

      } else {

        imagesToAssign = { imageId: fountainImageId, mapPinImageId: mapPinImageId };
      }

      this.fountainService
        .update(this.fountainId, imagesToAssign, { 'Accept-language': 'es' })
        .subscribe((response) => {
          this.ngxLoader.stop();
          this.router.navigate([this.routerDefinitions.sponsoredFountains, 'list']);
          this.toastr.success('Fuente actualizada con exito', 'Listo');
        }, error => {
          this.ngxLoader.stop();
          this.router.navigate([this.routerDefinitions.sponsoredFountains, 'list']);
          this.toastr.success('Fuente actualizada con exito', 'Listo');
          this.toastr.error('Ha ocurrido un problema al actualizar las imagenes', 'Error');
        });

    }
  }

  createSponsoredFountain(fountainId: string, values) {
    const valuesToCreateFountain: any = {
      brandId: values.brandInfo._id,
      name: values.brandInfo.name,
      fountainType: 'SPONSORED',
      userId: this.currentUser._id
    };
    this.fountainService
      .update(fountainId, valuesToCreateFountain, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();
          this.mapPinUploadImage();
        },
        error => {
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        });
  }

  // 1.
  mapPinUploadImage() {
    this.mapPinImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'fountains' }
      ]
    });

    if (this.mapPinImageUploader.queue.length > 0) {
      this.mapPinImageUploader.uploadAll();
    } else {
      this.fountainUploadImage();
    }

    this.mapPinImageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.fountainUploadImage(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
      }
    };
  }


  // 2.
  fountainUploadImage(mapPinImageId?: string) {
    this.fountainImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'fountains' }
      ]
    });

    if (this.fountainImageUploader.queue.length > 0) {
      this.fountainImageUploader.uploadAll();
    } else {
      this.assignImageToFountain(mapPinImageId);
    }

    this.fountainImageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToFountain(mapPinImageId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
      }
    };
  }

  changeLocalImage(event: any) {
    const self: SponsoredFountainCreateComponent = this;


    this.fountainForm.markAsDirty();
    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
        || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
        || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {

        const img = new Image();

        img.src = window.URL.createObjectURL(event.target.files[event.target.files.length - 1]);
        img.onload = function () {
          let width, height = 0;
          width = img.naturalWidth;
          height = img.naturalHeight;

          switch (event.target.id) {
            case 'mapPin-input':
              if (width <= 60 && height <= 99) {
                self.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
                  self.mapPinLocalImage = image;
                  self.isMapPinLocalImageChanged = true;
                });
              } else {
                self.mapPinImageUploader.clearQueue();
                self.mapPinImageUploaderInput.nativeElement.value = '';
                self.toastr.error('El tamaño excede del máximo permitido (60x99px)', 'Error');
              }
              break;

            case 'fountain-image-input':
              if (width <= 969 && height <= 1458) {
                self.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
                  self.fountainLocalImage = image;
                  self.isFountainLocalImageChanged = true;
                });
              } else {
                self.fountainImageUploader.clearQueue();
                self.fountainImageUploaderInput.nativeElement.value = '';
                self.toastr.error('El tamaño excede del máximo permitido (969x1458px)', 'Error');
              }
              break;
          }
        };
      } else {
        switch (event.target.id) {
          case 'mapPin-input':
            this.mapPinImageUploader.clearQueue();
            break;
          case 'fountain-image-input':
            this.fountainImageUploader.clearQueue();
            break;
        }
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  showDialogDeleteImage(uploaderSelected) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: '160px',
      disableClose: true,
      autoFocus: false,
      data: { message: '¿Está seguro que desea eliminar la imagen seleccionada?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (uploaderSelected) {
          case this.mapPinImageUploader:
            this.mapPinLocalImage = '';
            this.mapPinImageUploaderInput.nativeElement.value = '';
            this.isMapPinImageDeleted = true;
            this.mapPinImageUploader.clearQueue();
            if (this.mapPinImageId) {
              this.mapPinImageId = null;
            }
            break;
          case this.fountainImageUploader:
            this.fountainLocalImage = '';
            this.fountainImageUploaderInput.nativeElement.value = '';
            this.isFountainImageDeleted = true;
            this.fountainImageUploader.clearQueue();
            if (this.fountainImageId) {
              this.fountainImageId = null;
            }
            break;
        }
        this.fountainForm.markAsDirty();
      }
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

  getFountains() {
    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: 'instance.createdAt',
      filter: this.filter
    };
    this.fountainService
      .getAll(headers)
      .subscribe(
        (fountains: Fountain[]) => {
          this.privateFountains = [];
          fountains.forEach((fountain) => {
            if (fountain.fountainType) {
              fountain.fountainType = this.changeFountainTypeName(fountain.fountainType);
            }
            if (fountain.fountainStatus) {
              fountain.fountainStatus = this.changeFountainStatusName(fountain.fountainStatus);
            }
          });

          this.privateFountains = fountains;
        });
  }

  countFountains() {
    const headers = {
      filter: this.filter
    };
    this.fountainService
      .count(headers)
      .subscribe((response) => {
        if (response !== null) {
          this.paginator.length = 0;
          this.paginator.length = response.totalFountains;
        } else {
          this.paginator.length = 0;
        }
      });
  }


  getBrands() {
    const headers = {
      filter: `{ "brandStatus": { $ne: "DELETED" } }`
    };
    this.brandService
      .getAll(headers)
      .subscribe(
        (brands: Brand[]) => {
          this.brandsList = [];
          brands.forEach((brand) => {
            this.brandsList = [...this.brandsList,
            { value: { _id: brand._id, name: brand.name }, label: brand.name }
            ];
          });
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


  selectFountain(element) {
    this.fountainId = element._id;
  }

  paginate(event) {
    this.paginator.limit = event.pageSize;
    this.paginator.skip = event.pageSize * event.pageIndex;
    this.paginator.pageIndex = event.pageIndex;
    this.getFountains();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getFountains();
  }


  createFilter(filterValues) {
    const startFilter = '{"fountainType": { $nin: [ "PUBLIC", "SPONSORED" ] }, fountainStatus: { $ne: "DELETED"}';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const fountainTypeFilter = ',"fountainType": "' + filterValues.fountainType + '"';
    const addressFilter = ',"address.address": {$regex:".*' + filterValues.address + '", $options: "i"}';
    const fountainStatusFilter = ',"fountainStatus": "' + filterValues.fountainStatus + '"';
    const corporateIdFilter = ',"corporateId": ObjectId("' + filterValues.corporateId + '")';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.address !== '' && filterValues.address !== null) ? addressFilter : '')
      .concat((filterValues.fountainType !== '' && filterValues.fountainType !== null
        && filterValues.fountainType.length !== 0) ? fountainTypeFilter : '')
      // tslint:disable-next-line:max-line-length
      .concat((filterValues.fountainStatus !== '' && filterValues.fountainStatus !== null && filterValues.fountainStatus.length !== 0) ? fountainStatusFilter : '')
      // tslint:disable-next-line:max-line-length
      .concat((filterValues.corporateId !== '' && filterValues.corporateId !== null && filterValues.corporateId.length !== 0) ? corporateIdFilter : '')
      .concat(finishFilter);
  }
}
