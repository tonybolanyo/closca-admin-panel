import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { User } from 'src/app/shared/custom-gnommo-base/models';
import { CorporateService, FountainService, RefillService, UserService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';

@Component({
  selector: 'app-corporate-detail',
  templateUrl: './corporate-detail.component.html',
  styleUrls: ['./corporate-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorporateDetailComponent implements OnInit {
  action: string;
  corporateId: string;
  corporateForm: FormGroup;
  managerForm: FormGroup;
  corporate;
  manager;
  fountains;
  fountainTypeTranslate;
  fountainStatusTranslate;

  refills;

  // Uploader
  public logoCorporateUploader: FileUploader = new FileUploader({ url: '' });
  // public imageCorporateUploader: FileUploader = new FileUploader({ url: '' });
  // public impactCorporateUploader: FileUploader = new FileUploader({ url: '' });

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

  // START REFILL PAGINATOR
  refillPaginator = {
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

  isFormSaved = false;
  isFormCanceled = false;

  // UPLOADERS
  public invitationCSVUploader: FileUploader = new FileUploader({
    url: '',
    queueLimit: 1
  });
  @ViewChild('invitationCSVUploaderInput') invitationCSVUploaderInput: ElementRef;

  public createFountainsCSVUploader: FileUploader = new FileUploader({
    url: '',
    queueLimit: 1
  });
  @ViewChild('createFountainsCSVUploaderInput') createFountainsCSVUploaderInput: ElementRef;


  @ViewChild('logoUploaderInput') logoUploaderInput: ElementRef;
  // @ViewChild('imageUploaderInput', { static: false }) imageUploaderInput: ElementRef;
  // @ViewChild('impactUploaderInput', { static: false }) impactUploaderInput: ElementRef;

  // IMAGE
  logotype: string;
  // image: string;
  // impact: string;

  // Local image
  isLocalLogotypeChanged = false;
  localLogotype = '';

  // isLocalImageChanged = false;
  // localImage = '';

  // isLocalImpactChanged = false;
  // localImpact = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private dateAdapter: DateAdapter<Date>,
    private corporateService: CorporateService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private _location: Location,
    private userService: UserService,
    private fountainService: FountainService,
    private refillService: RefillService
  ) {
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.corporateId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getCorporateById(this.corporateId);
        this.countFountains(this.corporateId);
        this.getFountainsByCorporate(this.corporateId);
        this.countFountains(this.corporateId);
        this.getRefillsByCorporate(this.corporateId);
        this.countRefills(this.corporateId);
        break;
      case 'edit':
        this.buildForm(false);
        this.getCorporateById(this.corporateId);
        this.countFountains(this.corporateId);
        this.getFountainsByCorporate(this.corporateId);
        this.countFountains(this.corporateId);
        this.getRefillsByCorporate(this.corporateId);
        this.countRefills(this.corporateId);
        break;
      case 'new':
        this.buildForm(false);
        break;
    }
  }

  ngOnInit() {
    this.corporateForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
    });
    this.handlerLogoCorporateUploaders();
    // this.handlerImageCorporateUploaders();
    // this.handlerImpactCorporateUploaders();
  }

  navigateBack() {
    this._location.back();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.corporateForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.corporateForm = this.formBuilder.group({
      name: [{ value: null, disabled: disabled }, [Validators.required]],
      description: [{ value: null, disabled: disabled }],
      code: [{ value: null, disabled: disabled }, [Validators.required]],
      domainWord: [{ value: null, disabled: disabled }, [Validators.required]],
      // beaconMajor: [{ value: null, disabled: disabled }, [Validators.required]],
      color: [{ value: null, disabled: disabled }, [Validators.required]]
    });

    this.managerForm = this.formBuilder.group({
      realName: [{ value: null, disabled: disabled }, [Validators.required]],
      email: [{ value: null, disabled: disabled }, [Validators.required, Validators.email]],
    });
  }

  getCorporateById(corporateId: string) {
    this.corporateService
      .getById(corporateId)
      .subscribe(
        (corporate: any) => {
          this.corporate = corporate;
          this.corporateForm.patchValue(corporate);

          if (corporate.logotype) {
            this.logotype = corporate.logotype;
          }

          if (this.action == "edit" && this.corporate.code == "CLOSCA") {
            this.navigateBack();
          } else {
            this.getManager(this.corporate._id)
          }

        }
      );
  }

  getManager(corporateId) {
    const headers = convertToHttpHeaderMap({
      sort: 'instance.createdAt',
      limit: 1,
      filter: `{"corporateId": "${corporateId}))", "instance.status": {$ne: "DELETED"}, "role": "MANAGER"}`
    });

    this.userService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        if (response !== null) {
          this.manager = response[0]

          // if (this.manager.realName == undefined) {
          //   this.manager.realName = this.manager.userName
          // }

          this.managerForm.patchValue(this.manager);

        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar el administrador, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getFountainsByCorporate(corporateId) {
    const headers = convertToHttpHeaderMap({
      includes: 'fountainId',
      sort: 'instance.createdAt',
      limit: this.fountainsPaginator.limit,
      skip: this.fountainsPaginator.skip,
      filter: `{"corporateId": "${corporateId}))", "fountainStatus": {$ne: "DELETED"}}`
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

  getRefillsByCorporate(corporateId) {
    const headers = convertToHttpHeaderMap({
      includes: 'fountainId',
      sort: '-instance.createdAt',
      limit: this.refillPaginator.limit,
      skip: this.refillPaginator.skip,
    }));


    this.refillService
      .corporateRefills(corporateId, headers)
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

  countRefills(corporateId) {
    this.refillService
      .countCorporateRefills(corporateId)
      .subscribe((count) => {
        this.refillPaginator.length = 0;
        if (count) {
          this.refillPaginator.length = count;
        }
      });
  }

  paginateFountains(value) {
    this.getFountainsByCorporate(this.corporateId);
  }

  resetPaginateFountains() {
    this.fountainsPaginator.skip = 0;
    this.fountainsPaginator.pageIndex = 0;
    this.getFountainsByCorporate(this.corporateId);
  }

  paginateRefill(value) {
    this.getRefillsByCorporate(this.corporateId);
  }

  resetPaginateRefill() {
    this.refillPaginator.skip = 0;
    this.refillPaginator.pageIndex = 0;
    this.getRefillsByCorporate(this.corporateId);
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

  countFountains(corporateId) {
    const headers = convertToHttpHeaderMap({
      filter: `{"corporateId": "${corporateId}))", "fountainStatus": {$ne: "DELETED"}}`
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

  // SAVE FORM
  saveForm(corporateValues, managerValues, corporateValid, managerValid) {
    if (corporateValid && managerValid) {
      this.isFormSaved = true;

      switch (this.action) {
        case 'new':
          this.createCorporate(corporateValues, managerValues);
          break;

        case 'edit':
          this.updateCorporate(this.corporateId, corporateValues, managerValues);
          break;
      }
    }
  }

  registerManager(corporateValues, managerValues) {
    const headers = {
      "Accept-Language": "es"
    }

    const managerToRegister: User = {
      role: "MANAGER",
      email: managerValues.email,
      userName: managerValues.realName,
      realName: managerValues.realName,
      corporateCode: corporateValues.code
    }

    this.userService
      .register(managerToRegister, headers)
      .subscribe((response) => {

      },
        error => {
          this.toastr.error('Ha ocurrido un problema al registrar al administrador', 'Error');
        });
  }

  deleteManager(managerId, corporateValues, managerValues) {
    this.userService
      .delete(managerId)
      .subscribe((response) => {
        this.registerManager(corporateValues, managerValues)
      },
        error => {
          this.toastr.error('Ha ocurrido un problema al registrar al administrador', 'Error');
        });
  }

  updateManager(managerId, managerValues) {
    const managerToUpdate: User = {
      userName: managerValues.realName,
      realName: managerValues.realName
    }

    this.userService
      .update(managerId, managerToUpdate)
      .subscribe((response) => {

      },
        error => {
          this.toastr.error('Ha ocurrido un problema al actualizar al administrador', 'Error');
        });
  }

  handlerLogoCorporateUploaders() {
    this.logoCorporateUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'corporate_logo_' + new Date().getTime() + fileExtension;

      if (this.logoCorporateUploader.queue.length > 1) {
        this.logoCorporateUploader.queue.splice(0, 1);
      }
      this.corporateForm.markAsDirty();
    };
    this.logoCorporateUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  // handlerImageCorporateUploaders() {
  //   this.imageCorporateUploader.onAfterAddingFile = f => {
  //     if (this.imageCorporateUploader.queue.length > 1) {
  //       this.imageCorporateUploader.queue.splice(0, 1);
  //     }
  //     this.corporateForm.markAsDirty();
  //   };
  //   this.imageCorporateUploader.onBeforeUploadItem = (item) => {
  //     item.withCredentials = false;
  //     item.alias = 'attachments';
  //   };
  // }

  // handlerImpactCorporateUploaders() {
  //   this.impactCorporateUploader.onAfterAddingFile = f => {
  //     if (this.impactCorporateUploader.queue.length > 1) {
  //       this.impactCorporateUploader.queue.splice(0, 1);
  //     }
  //     this.corporateForm.markAsDirty();
  //   };
  //   this.impactCorporateUploader.onBeforeUploadItem = (item) => {
  //     item.withCredentials = false;
  //     item.alias = 'attachments';
  //   };
  // }

  corporateUploadLogo() {
    this.logoCorporateUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'corporates' }
      ]
    });

    if (this.logoCorporateUploader.queue.length > 0) {
      this.logoCorporateUploader.uploadAll();
    } else {
      // this.corporateUploadImage()
    }

    this.logoCorporateUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignLogoToCorporate(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Corporación no actualizada con exito', 'Error');
      }

    };
  }

  assignLogoToCorporate(logotype: string) {
    let logotypeToAssign: any = { logotype: logotype };
    this.corporateService
      .updateCorporate(this.corporateId, logotypeToAssign, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.router.navigate([this.routerDefinitions.corporates, 'list']);
        this.toastr.success('Corporación actualizada con exito', 'Listo');
        // this.corporateUploadImage()
      },
        error => {
          console.log(error);
          this.ngxLoader.stop();
          this.router.navigate([this.routerDefinitions.corporates, 'list']);
          this.toastr.error('Corporación no actualizada con exito', 'Error');
        });
  }

  // corporateUploadImage() {
  //   this.imageCorporateUploader.setOptions({
  //     url: `${environment.apiUrl}/images`,
  //     authToken: `Bearer ${this.authService.getToken().id}`,
  //     headers: [
  //       { name: 'Accept', value: 'application/json' },
  //       { name: 'Accept-language', value: 'es' },
  //       { name: 'destination', value: 'corporates' }
  //     ]
  //   });

  //   if (this.imageCorporateUploader.queue.length > 0) {
  //     this.imageCorporateUploader.uploadAll();
  //   } else {
  //     this.corporateUploadImpact()
  //   }

  //   this.imageCorporateUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
  //     if (status == 200) {
  //       const jsonResponse = JSON.parse(response);
  //       this.assignImageToCorporate(jsonResponse[0]._id);
  //     } else {
  //       this.ngxLoader.stop();
  //       this.toastr.error('Corporación no actualizada con exito', 'Error');
  //     }

  //   };
  // }

  // assignImageToCorporate(image: string) {
  //   let imageToAssign: any = { image: image };
  //   this.corporateService
  //     .updateCorporate(this.corporateId, imageToAssign, { 'Accept-language': 'es' })
  //     .subscribe((response) => {
  //       this.ngxLoader.stop();
  //       this.corporateUploadImpact()
  //     },
  //       error => {
  //         console.log(error);
  //         this.ngxLoader.stop();
  //         this.router.navigate([this.routerDefinitions.corporates, 'list']);
  //         this.toastr.error('Corporación no actualizada con exito', 'Error');
  //       });
  // }

  // corporateUploadImpact() {
  //   this.impactCorporateUploader.setOptions({
  //     url: `${environment.apiUrl}/images`,
  //     authToken: `Bearer ${this.authService.getToken().id}`,
  //     headers: [
  //       { name: 'Accept', value: 'application/json' },
  //       { name: 'Accept-language', value: 'es' },
  //       { name: 'destination', value: 'corporates' }
  //     ]
  //   });

  //   if (this.impactCorporateUploader.queue.length > 0) {
  //     this.impactCorporateUploader.uploadAll();
  //   } else {
  //     this.ngxLoader.stop();
  //     this.router.navigate([this.routerDefinitions.corporates, 'list']);
  //     this.toastr.success('Corporación actualizada con exito', 'Listo');

  //   }

  //   this.impactCorporateUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
  //     if (status == 200) {
  //       const jsonResponse = JSON.parse(response);
  //       this.assignImpactToCorporate(jsonResponse[0]._id);
  //     } else {
  //       this.ngxLoader.stop();
  //       this.toastr.error('Corporación no actualizada con exito', 'Error');
  //     }

  //   };
  // }

  // assignImpactToCorporate(impact: string) {
  //   let impactToAssign: any = { impactImage: impact };
  //   this.corporateService
  //     .updateCorporate(this.corporateId, impactToAssign, { 'Accept-language': 'es' })
  //     .subscribe((response) => {
  //       this.ngxLoader.stop();
  //       this.router.navigate([this.routerDefinitions.corporates, 'list']);
  //       this.toastr.success('Corporación actualizada con exito', 'Listo');
  //     },
  //       error => {
  //         console.log(error);
  //         this.ngxLoader.stop();
  //         this.router.navigate([this.routerDefinitions.corporates, 'list']);
  //         this.toastr.error('Corporación no actualizada con exito', 'Error');
  //       });
  // }

  updateCorporate(corporateId: string, corporateValues, managerValues) {
    this.corporateService
      .updateCorporate(corporateId, corporateValues, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          if (this.managerForm.dirty) {
            if (this.manager == undefined) {
              this.registerManager(corporateValues, managerValues)
            } else if (managerValues.email != this.manager.email) {
              this.deleteManager(this.manager._id, corporateValues, managerValues)
            } else if (managerValues.realName != this.manager.realName) {
              this.updateManager(this.manager._id, managerValues)
            }
          }

          if (this.logoCorporateUploader.queue.length > 0) { // || this.imageCorporateUploader.queue.length > 0 || this.impactCorporateUploader.queue.length > 0
            this.ngxLoader.start();
            this.corporateUploadLogo();
          } else {
            this.ngxLoader.stop();
            this.router.navigate([this.routerDefinitions.corporates, 'list']);
            this.toastr.success('Corporación actualizada con exito', 'Listo');
            // this.toastr.error('Debes subir un logo, una imagen y una imagen de impacto de la corporación', 'Error');
          }
        },
        error => {
          this.toastr.error('Corporación no actualizada con exito', 'Error');
        }
      );

  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  changeLocalLogotype(event: any) {
    this.corporateForm.markAsDirty();
    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'png' || fileName.substr(fileName.length - 3) === 'PNG') {
        this.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
          this.isLocalLogotypeChanged = true;
          this.localLogotype = image;

        });
      } else {
        this.logoCorporateUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  // changeLocalImage(event: any) {
  //   this.corporateForm.markAsDirty();
  //   if (event.target.files.length > 0) {
  //     const fileName = event.target.files[event.target.files.length - 1].name;

  //     if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
  //       || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
  //       || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {
  //       this.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
  //         this.isLocalImageChanged = true;
  //         this.localImage = image;

  //       });
  //     } else {
  //       this.imageCorporateUploader.clearQueue();
  //       this.toastr.error('El formato del archivo no es compatible', 'Error');
  //     }
  //   }
  // }

  // changeLocalImpact(event: any) {
  //   this.corporateForm.markAsDirty();
  //   if (event.target.files.length > 0) {
  //     const fileName = event.target.files[event.target.files.length - 1].name;

  //     if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
  //       || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
  //       || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {
  //       this.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {
  //         this.isLocalImpactChanged = true;
  //         this.localImpact = image;

  //       });
  //     } else {
  //       this.impactCorporateUploader.clearQueue();
  //       this.toastr.error('El formato del archivo no es compatible', 'Error');
  //     }
  //   }
  // }

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

  createCorporate(corporateValues, managerValues) {

    if (this.logoCorporateUploader.queue.length > 0) { // || this.imageCorporateUploader.queue.length > 0 || this.impactCorporateUploader.queue.length > 0
      this.corporateService
        .create(corporateValues, { 'Accept-language': 'es' })
        .subscribe((response) => {

          this.registerManager(corporateValues, managerValues);

          this.ngxLoader.start();
          this.corporateId = response._id;
          this.corporate = response;
          this.corporateUploadLogo();

        },
          error => {

            this.toastr.error('Ha ocurrido un problema al crear la corporación', 'Error');
          });
    } else {
      this.toastr.error('Debes subir un logo, una imagen y una imagen de impacto de la corporación', 'Error');
    }

  }

  changeInvitationCSV(files: FileList) {
    if (files.length > 0) {
      const fileName = files[files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'csv' ||
        fileName.substr(fileName.length - 3) === 'CSV'
      ) {
        let usersFile = null

        if (this.invitationCSVUploader.queue.length > 0) {
          usersFile = this.invitationCSVUploader.queue[this.invitationCSVUploader.queue.length - 1].file.rawFile;
          usersFile = usersFile.slice(0, usersFile.size, 'text/csv');
        }

        const invitationFormData = new FormData();

        if (usersFile !== null) {
          this.ngxLoader.start();

          invitationFormData.append('emails', usersFile);

          this.userService.invitateCorporateWithCSV(invitationFormData, this.corporateId).subscribe(
            response => {
              this.ngxLoader.stop();
              this.invitationCSVUploaderInput.nativeElement.value = '';
              this.invitationCSVUploader.clearQueue();
              this.toastr.success('Invitaciones enviadas', 'Listo');
            },
            error => {
              this.ngxLoader.stop();
              this.invitationCSVUploaderInput.nativeElement.value = '';
              this.invitationCSVUploader.clearQueue();
              this.toastr.error('Ha ocurrido un problema al invitar a los usuarios', 'Error');
            }
          );
        }

      } else {
        this.invitationCSVUploaderInput.nativeElement.value = '';
        this.invitationCSVUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  changeCreateFountainsCSV(files: FileList) {
    if (files.length > 0) {
      const fileName = files[files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'csv' ||
        fileName.substr(fileName.length - 3) === 'CSV'
      ) {
        let fountainsFile = null

        if (this.createFountainsCSVUploader.queue.length > 0) {
          fountainsFile = this.createFountainsCSVUploader.queue[this.createFountainsCSVUploader.queue.length - 1].file.rawFile;
          fountainsFile = fountainsFile.slice(0, fountainsFile.size, 'text/csv');
        }

        const createFountainsFormData = new FormData();

        if (fountainsFile !== null) {
          this.ngxLoader.start();

          createFountainsFormData.append('fountains', fountainsFile);

          console.log("Holita: ", this.corporateId)

          this.fountainService.createWithCSV(createFountainsFormData, this.corporateId).subscribe(
            response => {
              this.ngxLoader.stop();
              this.createFountainsCSVUploaderInput.nativeElement.value = '';
              this.createFountainsCSVUploader.clearQueue();
              this.toastr.success('Fuentes creadas', 'Listo');

              this.countFountains(this.corporateId)
              this.resetPaginateFountains()
            },
            error => {
              this.ngxLoader.stop();
              this.createFountainsCSVUploaderInput.nativeElement.value = '';
              this.createFountainsCSVUploader.clearQueue();
              this.toastr.error('Ha ocurrido un problema al crear las fuentes', 'Error');
            }
          );
        }

      } else {
        this.createFountainsCSVUploaderInput.nativeElement.value = '';
        this.createFountainsCSVUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

}
