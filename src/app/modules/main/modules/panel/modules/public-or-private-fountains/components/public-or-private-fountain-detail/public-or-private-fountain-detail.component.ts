import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Fountain, MultiLanguageObject } from 'src/app/shared/custom-gnommo-base/models/fountain.model';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
// tslint:disable-next-line: max-line-length
import { DatePipe, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@tyris/angular-foundation';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { FEATURES, FOUNTAIN_REFILL_TYPES, FOUNTAIN_STATUSES, PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES, S3_URL, STATION_TYPES, TIMES, WEEKDAYS } from 'src/app/shared/constants/constants';
import { CorporateService, RefillService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

declare var google;

@Component({
  selector: 'app-public-or-private-fountain-detail',
  templateUrl: './public-or-private-fountain-detail.component.html',
  styleUrls: ['./public-or-private-fountain-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublicOrPrivateFountainDetailComponent implements OnInit {

  corporates;
  corporateSelected;

  action: string;
  fountainId: string;
  fountainForm: UntypedFormGroup;
  fountainType;
  fountain;
  refills;

  fountainsAround;

  fountainStatusSelected;

  reopenDateTimestamp: number;
  reopenDate;

  inactiveReasons: MultiLanguageObject[] = [
    { en: "Ups!! Seems that the fountain is already in the app", es: "Ups!! Parece que la fuente ya existe en la app" },
    { en: "Ups!! The picture has not the required quality.", es: "Ups!! Parece que la calidad de la foto no es suficiente" },
    { en: "Ups!! The picture you added was not appropiate.", es: "Ups!! Parece que la foto no es adecuada" },
    { en: "The picture don't follow our privace policy", es: "La foto no cumple nuestra politica de privacidad" },
    // {en: "The picture don't follow our privace policy", es: "La foto no cumple nuestra politica de privacidad"},
    { en: "The picture must show the fountain completly. ", es: "Repite la foto. Ha de mostrar la fuente completamente" },
    { en: "Ups!! Seems that this fountain is not appropiate for our app.", es: "Ups!! Parece que este no es el tipo de fuentes que mostramos en la app" },
    { en: "Access to this fountain is not granted to public.", es: "Parece que la fuente no es de acceso público" },
    { en: "Ups!!! Seems that this fountain don't exist anymore.", es: "Parece que la fuente no existe" }
  ];

  // Uploader
  public imageFountainUploader: FileUploader = new FileUploader({ url: '' });

  // ENUMS
  fountainTypeOptions = PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES;
  stationTypeOptions = STATION_TYPES;
  fountainStatusOptions = FOUNTAIN_STATUSES;
  fountainRefillOptions = FOUNTAIN_REFILL_TYPES;
  fountainWeekDays = WEEKDAYS;
  features = FEATURES;
  times = TIMES;

  //  ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  // IMAGE
  imageWidth: number;
  imageHeight: number;
  fountainImageId: string;
  isFountainImageDeleted = false;
  @ViewChild('imageFountainUploaderInput') imageFountainUploaderInput: ElementRef;

  // Local image
  isFountainLocalImageChanged = false;
  fountainLocalImage = '';

  // GEOPOINT

  // tslint:disable-next-line:no-inferrable-types
  lat: number = 39.46559367644257;
  // tslint:disable-next-line:no-inferrable-types
  lng: number = -0.43073254669650396;

  address: string;

  // GEOINFO TO SAVE WHEN CHANGE MARKER OR SEARCH OTHER ADDRESS
  geoInfoToSave = null;

  // CONFIG TABLE
  tableRefillConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: true,
    buttonsConfig: {
      validateButton: false,
      viewButton: true,
      editButton: false,
      newButton: false,
      deleteButton: false,
      baseRouterLink: this.routerDefinitions.publicOrPrivateFountains
    },
    columns: [
      {
        columnDef: 'userName',
        columnValue: 'userInfo.userName',
        columnType: 'STRING',
        headerLabel: 'Nombre usuario',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Nombre usuario',
          formControl: {
            name: 'userName'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'email',
        columnValue: 'userInfo.email',
        columnType: 'STRING',
        headerLabel: 'Email usuario',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Email usuario',
          formControl: {
            name: 'email'
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

  editorConfig: AngularEditorConfig;

  // START REFILL PAGINATOR
  refillPaginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  role;
  corporateId;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private fountainService: FountainService,
    private refillService: RefillService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private _location: Location,
    private corporateService: CorporateService,
    private datePipe: DatePipe,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId();
    this.action = this.activatedRoute.snapshot.url[0].path;

    this.editorConfig = {
      editable: this.action !== 'view',
      spellcheck: true,
      height: '15rem',
      minHeight: '15rem',
      placeholder: 'Comentarios',
      defaultFontName: 'Arial'
    };

    this.fountainId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {

      case 'view':
        this.buildForm(true);
        this.getFountainById(this.fountainId);
        this.getCorporates();
        this.getFountainRefills();
        this.countRefills();
        break;

      case 'edit':
        this.buildForm(false);
        this.getFountainById(this.fountainId);
        this.getCorporates();
        this.getFountainRefills();
        this.countRefills();
        break;

      case 'new':
        this.buildForm(false);
        this.getCorporates();
        break;
    }
  }

  ngOnInit() {

    this.onChanges();
    this.handlerUploaders();

  }

  navigateBack() {
    this._location.back();
  }

  onChanges() {
    this.fountainForm.get('fountainType').valueChanges.subscribe(val => {
      this.fountainType = val;
    });
  }

  handlerUploaders() {
    this.imageFountainUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name =
        'fountain_image_' + new Date().getTime() + fileExtension;

      if (this.imageFountainUploader.queue.length > 1) {
        this.imageFountainUploader.queue.splice(0, 1);
      }
    };

    this.imageFountainUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.fountainForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.fountainForm = this.formBuilder.group({
      inactiveReason: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }],
        en: [{ value: null, disabled: disabled }]
      }),
      comment: [{ value: "", disabled: disabled }],
      name: [{ value: null, disabled: disabled }, Validators.required],
      fountainType: [{ value: null, disabled: disabled }, Validators.required],
      stationType: [{ value: null, disabled: disabled }, Validators.required],
      totalRefills: [{ value: null, disabled: true }],
      refillType: [{ value: null, disabled: disabled }],
      fountainStatus: [{ value: 'PENDING', disabled: disabled }],
      userInfo: this.formBuilder.group({
        userName: [{ value: null, disabled: true }],
        email: [{ value: null, disabled: true }],
        phoneNumber: [{ value: null, disabled: true }],
      }),
      loc: [{ value: null, disabled: false }],
      openTime: [{ value: null, disabled: disabled }],
      closeTime: [{ value: null, disabled: disabled }],
      weekDayStart: [{ value: null, disabled: disabled }],
      weekDayEnd: [{ value: null, disabled: disabled }],
      features: [{ value: [], disabled: disabled }],
      sharedAppleMapsString: [{ value: 'true', disabled: disabled }],
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        code: [{ value: null, disabled: true }]
      }),
      // indoorAddress: [{ value: null, disabled: disabled }],
      // beaconMinor: [{ value: null, disabled: disabled }],
      reopenDate: [{ value: null, disabled: disabled }]
    });
  }

  getFountainById(fountainId: string) {
    const self: PublicOrPrivateFountainDetailComponent = this;
    this.fountainService
      .getById(fountainId)
      .subscribe(
        (fountain: Fountain) => {
          this.fountain = fountain;
          this.fountainStatusSelected = fountain.fountainStatus;
          this.fountainImageId = fountain.imageId;
          this.fountainType = fountain.fountainType;
          const latlng = { lat: fountain.loc.coordinates[1], lng: fountain.loc.coordinates[0] };
          const geocoder = new google.maps.Geocoder();
          this.lat = fountain.loc.coordinates[1];
          this.lng = fountain.loc.coordinates[0];
          this.fountainForm.patchValue(fountain);

          if (fountain.sharedAppleMaps) {
            this.fountainForm.get('sharedAppleMapsString').setValue('true');
          } else {
            this.fountainForm.get('sharedAppleMapsString').setValue('false');
          }

          if (this.fountain.fountainStatus == "TEMP_CLOSED") {
            this.reopenDateTimestamp = this.fountain.reopenDate
            let date = new Date(this.reopenDateTimestamp)
            this.fountainForm.get('reopenDate').setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
          }

          this.corporateSelected = fountain.corporateInfo

          this.getFountainsByLocation(fountainId);

          geocoder.geocode({ location: latlng }, function (results, status) {
            // self.fountainForm.get('address.address').setValue(results[0].formatted_address);
            self.address = results[0].formatted_address;
          });
        }
      );
  }

  getFountainsByLocation(fountainId: string) {
    const headers = {
      'Authorization': `Bearer ${this.authService.getToken().id}`,
      'Accept': 'application/json',
      'Accept-language': 'es',
      'latitude': this.lat,
      'longitude': this.lng,
      'distance': 1000.0,
      'corporateCode': this.fountain.corporateInfo.code
    };

    this.fountainService
      .getByLocation(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();

        this.fountainsAround = response.filter(function (value) { return value._id != fountainId });

      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las fuentes cercanas', 'Error');
          this.ngxLoader.stop();
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

        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getFountainRefills() {

    const headers = {
      sort: '-instance.createdAt',
      limit: this.refillPaginator.limit,
      skip: this.refillPaginator.skip,
    };

    this.refillService
      .fountainRefills(this.fountainId, headers)
      .subscribe((response: any) => {
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

          this.refills = [];
          this.refills = response;
        }
      });
  }

  countRefills() {
    const headers = {
      filter: `{"fountainId": "${this.fountainId}"}`
    };
    this.refillService
      .count(headers)
      .subscribe((count) => {
        this.refillPaginator.length = 0;
        if (count) {
          this.refillPaginator.length = count;
        }

      });
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  fountainUploadImage() {

    this.imageFountainUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'fountains' },
        { name: 'width', value: `${this.imageWidth}` },
        { name: 'height', value: `${this.imageHeight}` }
      ]

    });

    if (this.imageFountainUploader.queue.length > 0) {

      this.imageFountainUploader.uploadAll();

    } else {

      this.ngxLoader.stop();
      this.navigateBack();
      this.toastr.success('Fuente actualizada con exito', 'Listo');

    }

    this.imageFountainUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToFountain(this.fountainId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
      }
    };
  }

  assignImageToFountain(fountainId: string, imageId: string) {

    let fountainToAssign;

    if (this.fountain.fountainType === 'PUBLIC') {

      fountainToAssign = {
        imageId: imageId
      };

    } else {

      fountainToAssign = {
        imageId: imageId,
        closeTime: this.fountain.closeTime,
        openTime: this.fountain.openTime
      };

    }

    this.fountainService
      .update(fountainId, fountainToAssign, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {

          this.ngxLoader.stop();
          this.navigateBack();

          if (this.action === 'edit') {
            this.toastr.success('Fuente actualizada con exito', 'Listo');
          }
        },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        });
  }

  changeLocalImage(event: any) {
    const self: PublicOrPrivateFountainDetailComponent = this;
    this.fountainForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (fileName.substr(fileName.length - 3) === 'jpg' || fileName.substr(fileName.length - 3) === 'png'
        || fileName.substr(fileName.length - 4) === 'jpeg' || fileName.substr(fileName.length - 3) === 'PNG'
        || fileName.substr(fileName.length - 3) === 'JPG' || fileName.substr(fileName.length - 3) === 'JPEG') {

        const img = new Image();

        img.src = window.URL.createObjectURL(
          event.target.files[event.target.files.length - 1]
        );
        img.onload = function () {
          // start onLoad Img
          let width,
            height = 0;
          width = img.naturalWidth;
          height = img.naturalHeight;

          if (width < 924 || height < 924) {
            self.imageFountainUploader.clearQueue()
            self.imageFountainUploaderInput.nativeElement.value = '';
            self.toastr.error(
              'La imagen debe de ser de, al menos, 924px de alto o de ancho',
              'Error'
            );
          } else {
            let done = false
            if (width > height) {
              done = !((width / 2) > height)
            } else {
              done = !((height / 2) > width)
            }

            if (done) {
              self.getBase64(event.target.files[event.target.files.length - 1]).then((image: string) => {

                self.isFountainLocalImageChanged = true;
                self.fountainLocalImage = image;
                self.imageWidth = width;
                self.imageHeight = height;
              });
            } else {
              self.imageFountainUploader.clearQueue()
              self.imageFountainUploaderInput.nativeElement.value = '';
              self.toastr.error(
                'El aspect ratio no es correcto',
                'Error'
              );
            }

          }

        }

      } else {

        this.imageFountainUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  corporateChange(event) {
    this.corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.fountainForm.controls['corporateInfo'].get('code').setValue(this.corporateSelected.code);
  }

  onFountainStatusChange(value) {
    this.fountainStatusSelected = value

    if (this.fountainStatusSelected == "TEMP_CLOSED") {
      this.reopenDateTimestamp = (new Date()).getTime() + 7776000000;
      let date = new Date(this.reopenDateTimestamp)
      this.fountainForm.get('reopenDate').setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
    }
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

        this.fountainForm.markAsDirty();
        if (this.fountainImageId) {
          this.fountainImageId = null;
        }

        this.isFountainImageDeleted = true;
        this.isFountainLocalImageChanged = true;
        this.fountainLocalImage = '';
        this.imageWidth = 0;
        this.imageHeight = 0;

        if (this.imageFountainUploaderInput) {
          this.imageFountainUploaderInput.nativeElement.value = '';
        }

        this.imageFountainUploader.clearQueue();
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

  saveForm(values, valid) {

    if (valid) {
      this.isFormSaved = true;

      if (values.fountainStatus == "INACTIVE" && values.inactiveReason == null) {
        // No hay inactiveReason
        this.toastr.error('Debes seleccionar un motivo de inactiva', 'Error');
        return;
      } else if (values.fountainStatus != "INACTIVE") {
        // No se ha seleccionado fountainStatus INACTIVE
        values.inactiveReason = null;

        if (values.fountainStatus == "TEMP_CLOSED") {
          let newTimestamp = (new Date(values.reopenDate)).getTime()

          if (newTimestamp <= (new Date()).getTime()) {
            this.toastr.error('La fecha de reapertura no puede ser menor a la actual', 'Error');
            return;
          }

          values.reopenDate = (new Date(values.reopenDate)).getTime()
        } else {
          delete values.reopenDate;
        }

      } else {
        // Se ha seleccionado fountainStatus INACTIVE y un inactiveReason
        this.inactiveReasons.forEach(element => {
          if (element.es == values.inactiveReason.es) {
            values.inactiveReason.en = element.en
            return;
          }
        });
      }

      const loc = { type: 'Point', coordinates: [this.lng, this.lat] };
      values.loc = loc;

      values.sharedAppleMaps = (values.sharedAppleMapsString == 'true')

      delete values.sharedAppleMapsString;

      if (values.fountainType === 'PUBLIC') {

        delete values.openTime;
        delete values.closeTime;
        delete values.weekDayEnd;
        delete values.weekDayStart;
        delete values.features;
        delete values.refillType;

        // values.corporateId = this.corporates.filter(corporate => corporate.code === 'CLOSCA')[0]._id

        if (this.role == "MANAGER") {
          values.corporateId = this.corporateId
        } else {
          values.corporateId = values.corporateId = this.corporates.filter(corporate => corporate.code === 'CLOSCA')[0]._id
        }

        switch (this.action) {
          case 'new':
            this.createFountain(values);
            break;

          case 'edit':
            this.updateFountain(this.fountainId, values);
            break;
        }

      } else {

        if (values.features.length >= 2 && values.features.length <= 10) {

          // if (this.corporateSelected.code != undefined) {
          //   if (this.corporateSelected.code != 'CLOSCA' && (values.indoorAddress === null || values.indoorAddress === "")) {
          //     this.toastr.error('Debes indicar un edificio', 'Error');
          //     return
          //   } else if (this.corporateSelected.code != 'CLOSCA' && (values.beaconMinor === null || values.beaconMinor === "")) {
          //     this.toastr.error('Debes indicar un ID de Beacon (Minor)', 'Error');
          //     return
          //   }
          // }

          // values.corporateId = values.corporateInfo._id

          if (this.role == "MANAGER") {
            values.corporateId = this.corporateId
          } else {
            values.corporateId = values.corporateInfo._id
          }

          switch (this.action) {
            case 'new':
              this.createFountain(values);
              break;

            case 'edit':
              this.updateFountain(this.fountainId, values);
              break;

          }

        } else {

          this.toastr.error('Debes seleccionar entre 2 y 10 características', 'Error');
        }
      }
    }
  }

  createFountain(values) {

    this.fountainService
      .create(values, { 'Accept-language': 'es' })
      .subscribe((response) => {

        this.ngxLoader.start();
        this.fountainId = response._id;
        this.fountain = response;
        this.fountainUploadImage();

      },
        error => {
          this.toastr.error('Ha ocurrido un problema al crear la fuente', 'Error');
        });
  }

  updateFountain(fountainId: string, values) {

    if (values.comment.length > 1024) {
      this.toastr.error('El comentario debe tener máximo 1024 caracteres', 'Error');
      return;
    }

    this.fountainService
      .getById(fountainId)
      .subscribe(
        (fountain: Fountain) => {
          this.fountain = fountain;



          let valuesFountain: any;
          valuesFountain = Object.assign({}, this.fountain);

          // Use to remove img if conditions are true
          if (this.fountainImageId === null && this.imageFountainUploader.queue.length === 0) {
            if (valuesFountain.imageId) {
              delete valuesFountain.imageId;
            }
          }

          if (valuesFountain.brandInfo) {
            delete valuesFountain.brandInfo;
          }
          if (valuesFountain.imageInfo) {
            delete valuesFountain.imageInfo;
          }
          if (valuesFountain.userInfo) {
            delete valuesFountain.userInfo;
          }
          if (valuesFountain.mapPinImageInfo) {
            delete valuesFountain.mapPinImageInfo;
          }


          if (values.fountainType === 'PUBLIC') {
            if (valuesFountain.openTime) {
              delete valuesFountain.openTime;
            }
            if (valuesFountain.closeTime) {
              delete valuesFountain.closeTime;
            }
            if (valuesFountain.weekDayEnd) {
              delete valuesFountain.weekDayEnd;
            }
            if (valuesFountain.weekDayStart) {
              delete valuesFountain.weekDayStart;
            }
            if (valuesFountain.features) {
              delete valuesFountain.features;
            }
            if (valuesFountain.refillType) {
              delete valuesFountain.refillType;
            }
          }


          const valuesToUpdate = Object.assign(valuesFountain, values);

          //
          // SET NEW ADDRESS AND GEOINFO
          //
          if (this.geoInfoToSave !== null) {
            const address = {
              address: this.geoInfoToSave.route + (this.geoInfoToSave.streetNumber !== null ? ' ' + this.geoInfoToSave.streetNumber : ''),
              postalCode: this.geoInfoToSave.postalCode,
              country: this.geoInfoToSave.country,
              town: this.geoInfoToSave.locality,
              province: this.geoInfoToSave.administrativeAreaLevel2
            };

            valuesToUpdate.geoInfo = this.geoInfoToSave;
            valuesToUpdate.address = address;
          }

          if (fountain.fountainStatus == valuesToUpdate.fountainStatus) {
            delete valuesToUpdate.fountainStatus
          }

          this.fountainService
            .update(fountainId, valuesToUpdate, { 'Accept-language': 'es' })
            .subscribe(
              (response) => {
                this.ngxLoader.start();
                this.fountain = valuesToUpdate;
                this.fountainUploadImage();
              },
              error => {
                this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
              }
            );

        }, error => {
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        }
      );




  }

  //
  // Method used to search with geoCode and change values of geoInfo/address/lat&lng
  //
  markerDragEnd(event: any) {

    const self: PublicOrPrivateFountainDetailComponent = this;
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    const latlng = { lat: this.lat, lng: this.lng };
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latlng }, function (results, status) {

      self.handlerGeoInfoData(results[0]);
      self.address = results[0].formatted_address;

    });
  }

  //
  // Method used to search and change address/geoInfo/lat&lng by google-autocomplete
  //
  handleAddressChange(address: Address) {

    this.handlerGeoInfoData(address);
    this.address = address.formatted_address;
    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();

  }


  //
  // Used to load data into geoInfoToSave variable when address is changed
  // data = results of geocode info
  //

  handlerGeoInfoData(data) {
    this.geoInfoToSave = {
      route: null,
      streetNumber: null,
      postalCode: null,
      locality: null,
      country: null,
      administrativeAreaLevel1: null,
      administrativeAreaLevel2: null
    };
    let addressTypeSelected = null;

    data.address_components.forEach((address_component: any) => {

      addressTypeSelected = null;

      for (const type of address_component.types) {

        switch (type) {
          case 'route':
            addressTypeSelected = 'route';
            break;

          case 'street_number':
            addressTypeSelected = 'streetNumber';
            break;

          case 'postal_code':
            addressTypeSelected = 'postalCode';
            break;

          case 'locality':
            addressTypeSelected = 'locality';
            break;

          case 'country':
            addressTypeSelected = 'country';
            break;

          case 'administrative_area_level_1':
            addressTypeSelected = 'administrativeAreaLevel1';
            break;

          case 'administrative_area_level_2':
            addressTypeSelected = 'administrativeAreaLevel2';
            break;

          case 'administrative_area_level_3':
            addressTypeSelected = 'administrativeAreaLevel2';
            break;

          case 'administrative_area_level_4':
            addressTypeSelected = 'administrativeAreaLevel2';
            break;
        }

        if (addressTypeSelected !== null) {
          break;
        }

      }

      if (addressTypeSelected !== null) {
        this.geoInfoToSave[addressTypeSelected] = address_component.long_name;
      }
    });
    this.fountainForm.markAsDirty();
  }

  paginateRefill(value) {
    this.getFountainRefills();
  }

  resetPaginateRefill() {
    this.refillPaginator.skip = 0;
    this.refillPaginator.pageIndex = 0;
    this.getFountainRefills();


  }
}
