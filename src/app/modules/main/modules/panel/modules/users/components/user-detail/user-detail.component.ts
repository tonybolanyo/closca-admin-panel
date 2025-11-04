import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@tyris/angular-foundation';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { CorporateService, FountainService, UserService } from 'src/app/shared/custom-gnommo-base/services';
import { BottleService } from 'src/app/shared/custom-gnommo-base/services/bottle.service';
import { HydrationRefillService } from 'src/app/shared/custom-gnommo-base/services/hydration-refill.service';
import { RefillService } from 'src/app/shared/custom-gnommo-base/services/refill.service';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class UserDetailComponent implements OnInit {
  action: string;
  userId: string;
  userForm: FormGroup;
  user;
  corporates;
  bottles;
  fountains;
  fountainTypeTranslate;
  fountainStatusTranslate;

  refills;
  hydrationRefills;

  // Uploader
  public imageUserUploader: FileUploader = new FileUploader({ url: '' });

  // --> ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  // START FOUNTAINS PAGINATOR
  fountainsPaginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  // START BOTTLES PAGINATOR
  bottlesPaginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  // START REFILL PAGINATOR
  refillPaginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  // START HYDRATION REFILL PAGINATOR
  hydrationRefillPaginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  // CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: true,
    buttonsConfig: {
      validateButton: true,
      viewButton: false,
      editButton: true,
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

  // CONFIG TABLE
  tableRefillConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: true,
    buttonsConfig: {
      validateButton: false,
      viewButton: false,
      editButton: false,
      newButton: false,
      deleteButton: false,
      baseRouterLink: this.routerDefinitions.publicOrPrivateFountains
    },
    columns: [
      {
        columnDef: 'fountainName',
        columnValue: 'fountainInfo.name',
        columnType: 'STRING',
        headerLabel: 'Nombre fuente',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Nombre',
          formControl: {
            name: 'fountainName'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'fountainAddress',
        columnValue: 'fountainInfo.address.address',
        columnType: 'STRING',
        headerLabel: 'Dirección fuente',
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
        columnDef: 'rating',
        columnValue: 'fountainInfo.rating',
        columnType: 'RATING',
        headerLabel: 'Valoración',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Valoración',
          formControl: {
            name: 'rating'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'createdDateHour',
        columnValue: 'createdDateHour',
        columnType: 'STRING',
        headerLabel: 'Fecha refill',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Fecha refill',
          formControl: {
            name: 'instanceCreatedAt'
          },
          sortFilterExists: false
        }
      }
    ]
  };

  // CONFIG TABLE
  tableHydrationRefillConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: true,
    columns: [
      {
        columnDef: 'quantity',
        columnValue: 'quantity',
        columnType: 'STRING',
        headerLabel: 'Cantidad',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Cantidad',
          formControl: {
            name: 'quantity'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'createdDateHour',
        columnValue: 'createdDateHour',
        columnType: 'STRING',
        headerLabel: 'Fecha refill',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Fecha refill',
          formControl: {
            name: 'instanceCreatedAt'
          },
          sortFilterExists: false
        }
      }
    ]
  };

  // CONFIG TABLE
  tableBottlesConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: true,
    buttonsConfig: {
      validateButton: false,
      viewButton: true,
      editButton: false,
      newButton: false,
      deleteButton: false
    },
    columns: [
      {
        columnDef: 'bottleImage',
        columnValue: 'bottleTypeInfo.imageInfo.fileRoute',
        headerLabel: 'Imagen botella',
        columnType: 'IMG',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Imagen botella',
          formControl: {
            name: 'bottleImage'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'bottleName',
        columnValue: 'name',
        columnType: 'STRING',
        headerLabel: 'Nombre',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Nombre',
          formControl: {
            name: 'bottleName'
          },
          sortFilterExists: false
        }
      }
    ]
  };

  isFormSaved = false;
  isFormCanceled = false;

  @ViewChild('imageUserUploaderInput') imageUserUploaderInput: ElementRef;

  // IMAGE
  avatarId: string;
  isAvatarImageDeleted = false;

  // Local image
  isLocalImageChanged = false;
  localImage = '';

  role;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private dateAdapter: DateAdapter<Date>,
    private userService: UserService,
    private corporateService: CorporateService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private _location: Location,
    private refillService: RefillService,
    private hydrationRefillService: HydrationRefillService,
    private fountainService: FountainService,
    private bottleService: BottleService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.userId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getUserById(this.userId);
        this.getCorporates();
        this.getFountainsByUser(this.userId);
        this.getBottlesByUser(this.userId);
        this.countBottles(this.userId);
        this.countRefills(this.userId);
        this.countHydrationRefills(this.userId);
        this.countFountains(this.userId);
        this.getRefillsByUser(this.userId);
        this.getHydrationRefillsByUser(this.userId);
        break;
      case 'edit':
        this.buildForm(false);
        this.getUserById(this.userId);
        this.getCorporates();
        this.getFountainsByUser(this.userId);
        this.getBottlesByUser(this.userId);
        this.countBottles(this.userId);
        this.countRefills(this.userId);
        this.countHydrationRefills(this.userId);
        this.countFountains(this.userId);
        this.getRefillsByUser(this.userId);
        this.getHydrationRefillsByUser(this.userId);
        break;
      case 'new':
        this.buildForm(false);
        this.userForm.addControl('password', new FormControl(
          { value: null, disabled: false })
        );
        break;
    }
  }

  ngOnInit() {
    this.userForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
    });
    this.handlerImageUserUploaders();
  }

  navigateBack() {
    this._location.back();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.userForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.userForm = this.formBuilder.group({
      userName: [{ value: null, disabled: disabled }, [Validators.required]],
      email: [{ value: null, disabled: disabled }, [Validators.required, Validators.email]],
      emailVerified: [{ value: null, disabled: disabled }],
      phoneNumber: [{ value: null, disabled: disabled }],
      closcaPoints: [{ value: null, disabled: disabled }],
      totalRefills: [{ value: null, disabled: true }],
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        code: [{ value: null, disabled: true }]
      }),
      levelInfo: this.formBuilder.group({
        code: [{ value: null, disabled: true }]
      })
    });
  }

  getUserById(userId: string) {
    this.userService
      .getById(userId, { 'includes': 'avatarId' })
      .subscribe(
        (user: any) => {
          this.user = user;
          this.userForm.patchValue(user);

          if (user.avatarId) {
            this.avatarId = user.avatarId;
          }
        }
      );
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.corporates = [];
        if (response !== null) {
          this.corporates = response;

        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getBottlesByUser(userId) {
    const headers = convertToHttpHeaderMap({
      sort: 'instance.createdAt',
      limit: this.bottlesPaginator.limit,
      skip: this.bottlesPaginator.skip,
      filter: `{"userId": "${userId}))"}`
    });

    this.bottleService
      .getAll(headers)
      .subscribe((bottles: any) => {
        if (bottles) {

          this.bottles = bottles;

        }
      });
  }

  getFountainsByUser(userId) {
    const headers = convertToHttpHeaderMap({
      includes: 'fountainId',
      sort: 'instance.createdAt',
      limit: this.fountainsPaginator.limit,
      skip: this.fountainsPaginator.skip,
      filter: `{"userId": "${userId}))", "fountainStatus": {$ne: "DELETED"}}`
    });

    this.fountainService
      .getAll(headers)
      .subscribe((fountains: any) => {
        if (fountains) {

          this.fountains = fountains;

          this.fountains.forEach(element => {
            element.fountainType = this.changeFountainTypeName(element.fountainType);
            element.fountainStatus = this.changeFountainStatusName(element.fountainStatus);
          });
        }
      });
  }

  getRefillsByUser(userId) {
    const headers = convertToHttpHeaderMap({
      includes: 'fountainId',
      sort: '-instance.createdAt',
      limit: this.refillPaginator.limit,
      skip: this.refillPaginator.skip,
    }));


    this.refillService
      .userRefills(userId, headers)
      .subscribe(
        (response: any) => {
          if (response) {
            response.map((refill) => {
              refill.createdDateHour = moment(new Date(refill.instance.createdAt)).format('DD/MM/YYYY - HH:mm');

              if (!refill.fountainInfo.name) {
                if (refill.fountainInfo.fountainType) {
                  if (refill.fountainInfo.fountainType === 'PUBLIC') {
                    refill.fountainInfo.name = 'Fuente publica';
                  } else {
                    refill.fountainInfo.name = 'Fuente privada';
                  }
                } else {
                  refill.fountainInfo.name = 'Nombre no disponible';
                }
              }

              if (!refill.fountainInfo.address.address) {
                refill.fountainInfo.address.address = 'Dirección no disponible';
              }

              // TODO: Remove when rating is implemented
              if (!refill.fountainInfo.rating) {
                refill.fountainInfo.rating = Math.random() * (5 - 0) + 0;
              }

            });
          }

          this.refills = [];
          this.refills = response;
        }
      );
  }

  getHydrationRefillsByUser(userId) {
    const headers = convertToHttpHeaderMap({
      sort: '-instance.createdAt',
      limit: this.hydrationRefillPaginator.limit,
      skip: this.hydrationRefillPaginator.skip,
      filter: `{"userId": "${userId}))"}`
    });

    this.hydrationRefillService
      .userRefills(headers)
      .subscribe(
        (response: any) => {
          if (response) {
            response.map((hydrationRefill) => {
              hydrationRefill.createdDateHour = moment(new Date(hydrationRefill.instance.createdAt)).format('DD/MM/YYYY - HH:mm');
            });
          }

          this.hydrationRefills = [];
          this.hydrationRefills = response;
        }
      );
  }

  countBottles(userId) {
    const headers = convertToHttpHeaderMap({
      filter: `{"userId": "${userId}))"}`
    });
    this.bottleService
      .count(headers)
      .subscribe((count) => {
        this.bottlesPaginator.length = 0;
        if (count) {
          this.bottlesPaginator.length = count;
        }

      });
  }

  countFountains(userId) {
    const headers = convertToHttpHeaderMap({
      filter: `{"userId": "${userId}))", "fountainStatus": {$ne: "DELETED"}}`
    });
    this.fountainService
      .count(headers)
      .subscribe((count) => {
        this.fountainsPaginator.length = 0;
        if (count) {
          this.fountainsPaginator.length = count.totalFountains;
        }

      });
  }

  countRefills(userId) {
    const headers = convertToHttpHeaderMap({
      filter: `{"userId": "${userId}))"}`
    });
    this.refillService
      .count(headers)
      .subscribe((count) => {
        this.refillPaginator.length = 0;
        if (count) {
          this.refillPaginator.length = count;
        }
      });
  }

  countHydrationRefills(userId) {
    const headers = convertToHttpHeaderMap({
      filter: `{"userId": "${userId}))"}`
    });
    this.hydrationRefillService
      .count(headers)
      .subscribe((count) => {
        this.hydrationRefillPaginator.length = 0;
        if (count) {
          this.hydrationRefillPaginator.length = count;
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
        this.userForm.markAsDirty();
        if (this.avatarId) {
          this.avatarId = null;
        }
        this.isAvatarImageDeleted = true;
        this.isLocalImageChanged = true;
        this.localImage = '';
        this.imageUserUploaderInput.nativeElement.value = '';
        this.imageUserUploader.clearQueue();
      }
    });
  }

  // SAVE FORM
  saveForm(values, valid) {
    if (valid) {
      this.isFormSaved = true;

      values.corporateId = values.corporateInfo._id

      this.updateUser(this.userId, values);
    }
  }

  corporateChange(event) {
    let corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.userForm.controls['corporateInfo'].get('code').setValue(corporateSelected.code);
  }

  handlerImageUserUploaders() {
    this.imageUserUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'user_image_' + new Date().getTime() + fileExtension;

      if (this.imageUserUploader.queue.length > 1) {
        this.imageUserUploader.queue.splice(0, 1);
      }
      this.userForm.markAsDirty();
    };
    this.imageUserUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  userUploadImage() {
    this.imageUserUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'users' }
      ]
    });

    if (this.imageUserUploader.queue.length > 0) {
      this.imageUserUploader.uploadAll();
    } else {
      this.ngxLoader.stop();
      this.router.navigate([this.routerDefinitions.users, 'list']);
      this.toastr.success('Usuario actualizado con exito', 'Listo');
    }

    this.imageUserUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToUser(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Usuario no actualizado con exito', 'Error');
      }
    };
  }

  assignImageToUser(avatarId: string) {
    let avatarToAssign: any = { avatarId: avatarId };
    this.userService
      .update(this.userId, avatarToAssign, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.router.navigate([this.routerDefinitions.users, 'list']);
        this.toastr.success('Usuario actualizado con exito', 'Listo');
      },
        error => {
          this.ngxLoader.stop();
          this.router.navigate([this.routerDefinitions.users, 'list']);
          this.toastr.error('Usuario no actualizado con exito', 'Error');
        });
  }

  updateUser(userId: string, values) {
    this.userService
      .update(userId, values, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();
          this.userUploadImage();
        },
        error => {
          this.toastr.error('Usuario no actualizado con exito', 'Error');
        }
      );
  }

  deleteUserImage(id) {
    this.userService
      .deleteAvatarImage(id)
      .subscribe((response) => {
        this.userUploadImage();
      },
        error => {
          this.userUploadImage();
        });
  }

  changeLocalImage(event: any) {
    this.userForm.markAsDirty();
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
        this.imageUserUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
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

  paginateFountains(value) {
    this.getFountainsByUser(this.userId);
  }

  paginateBottles(value) {
    this.getBottlesByUser(this.userId);
  }

  resetPaginateBottles() {
    this.bottlesPaginator.skip = 0;
    this.bottlesPaginator.pageIndex = 0;
    this.getBottlesByUser(this.userId);
  }

  resetPaginateFountains() {
    this.fountainsPaginator.skip = 0;
    this.fountainsPaginator.pageIndex = 0;
    this.getFountainsByUser(this.userId);
  }

  paginateRefill(value) {
    this.getRefillsByUser(this.userId);
  }

  resetPaginateRefill() {
    this.refillPaginator.skip = 0;
    this.refillPaginator.pageIndex = 0;
    this.getRefillsByUser(this.userId);
  }

  paginateHydrationRefill(value) {
    this.getHydrationRefillsByUser(this.userId);
  }

  resetPaginateHydrationRefill() {
    this.hydrationRefillPaginator.skip = 0;
    this.hydrationRefillPaginator.pageIndex = 0;
    this.getHydrationRefillsByUser(this.userId);
  }

  customViewNavigate(element) {

    if (element.fountainInfo.instance.status === 'DELETED' || element.fountainInfo.fountainStatus === 'DELETED') {
      this.toastr.error('Esta fuente ha sido borrada', 'Error');
    } else {
      if (element.fountainInfo.fountainType === 'PUBLIC') {
        this.router.navigate([this.routerDefinitions.publicOrPrivateFountains, 'view', element.fountainId]);
      } else {
        this.router.navigate([this.routerDefinitions.sponsoredFountains, 'view', element.fountainId]);
      }
    }
  }
}
