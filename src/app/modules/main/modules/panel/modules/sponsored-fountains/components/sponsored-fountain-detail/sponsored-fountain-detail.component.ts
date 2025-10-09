import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@tyris/angular-foundation';
import { FileUploader } from 'ng2-file-upload';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { FEATURES, FOUNTAIN_REFILL_TYPES, S3_URL, TIMES, WEEKDAYS } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Fountain } from 'src/app/shared/custom-gnommo-base/models/fountain.model';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';
// tslint:disable-next-line: max-line-length
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TransformSponsoredFountainToPrivateComponent } from 'src/app/shared/components/transform-sponsored-fountain-to-private/transform-sponsored-fountain-to-private.component';
import { CorporateService, RefillService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

declare var google;

@Component({
  selector: 'app-sponsored-fountain-detail',
  templateUrl: './sponsored-fountain-detail.component.html',
  styleUrls: ['./sponsored-fountain-detail.component.scss']
})
export class SponsoredFountainDetailComponent implements OnInit {

  action: string;
  fountainId: string;
  fountainForm: FormGroup;
  fountain;
  backToBrand;
  refills;

  fountainsAround;

  corporates;
  corporateSelected;

  // UPLOADERS
  public mapPinImageUploader: FileUploader = new FileUploader({ url: '' });
  public fountainImageUploader: FileUploader = new FileUploader({ url: '' });

  // IMAGES
  mapPinImageId: string;
  mapPinLocalImage = '';
  isMapPinImageDeleted = false;
  isMapPinLocalImageChanged = false;

  imageId: string;
  fountainLocalImage = '';
  isFountainImageDeleted = false;
  isFountainLocalImageChanged = false;

  @ViewChild('mapPinImageUploaderInput', { static: false }) mapPinImageUploaderInput: ElementRef;
  @ViewChild('fountainImageUploaderInput', { static: false }) fountainImageUploaderInput: ElementRef;
  // END IMAGES

  // ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;

  // ROUTES
  currentUrl: string;
  previousUrl: string;

  // ENUMS
  fountainRefillOptions = FOUNTAIN_REFILL_TYPES;
  fountainWeekDays = WEEKDAYS;
  features = FEATURES;
  times = TIMES;

  isFormSaved = false;
  isFormCanceled = false;

  // GEOPOINT
  // tslint:disable-next-line:no-inferrable-types
  lat: number = 39.46559367644257;
  // tslint:disable-next-line:no-inferrable-types
  lng: number = -0.43073254669650396;


  address: string;

  // TODO (Change THIS) Used to set PUT address
  selectedAddress: string;

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
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private fountainService: FountainService,
    private refillService: RefillService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _location: Location,
    private corporateService: CorporateService,
    private ngxLoader: NgxUiLoaderService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();

    this.action = this.activatedRoute.snapshot.url[0].path;
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

    }
  }

  ngOnInit() {

    this.handlerUploaders();

  }

  navigateBack() {
    this._location.back();
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
  }



  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.fountainForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.fountainForm = this.formBuilder.group({
      name: [{ value: null, disabled: disabled }],
      loc: [{ value: null, disabled: false }],
      totalRefills: [{ value: null, disabled: true }],
      refillType: [{ value: null, disabled: disabled }],
      fountainStatus: [{ value: null, disabled: disabled }],
      openTime: [{ value: null, disabled: disabled }],
      closeTime: [{ value: null, disabled: disabled }],
      weekDayStart: [{ value: null, disabled: disabled }],
      weekDayEnd: [{ value: null, disabled: disabled }],
      features: [{ value: [], disabled: disabled }],
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        code: [{ value: null, disabled: true }]
      }),
    });
  }

  getFountainById(fountainId: string) {
    const self: SponsoredFountainDetailComponent = this;
    this.fountainService
      .getById(fountainId)
      .subscribe(
        (fountain: Fountain) => {
          this.fountain = fountain;
          this.mapPinImageId = fountain.mapPinImageId;
          this.imageId = fountain.imageId;
          // this.brandImageId = fountain.brandImageId;
          const latlng = { lat: fountain.loc.coordinates[1], lng: fountain.loc.coordinates[0] };
          const geocoder = new google.maps.Geocoder();
          this.lat = fountain.loc.coordinates[1];
          this.lng = fountain.loc.coordinates[0];
          this.fountainForm.patchValue(fountain);

          this.corporateSelected = fountain.corporateInfo

          this.getFountainsByLocation(fountainId);

          geocoder.geocode({ location: latlng }, function (results, status) {
            // self.fountainForm.get('address.address').setValue(results[0].formatted_address);
            self.address = results[0].formatted_address;
            self.selectedAddress = results[0].formatted_address;
          });
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

  corporateChange(event) {
    this.corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.fountainForm.controls['corporateInfo'].get('code').setValue(this.corporateSelected.code);
  }

  changeLocalImage(event: any) {
    const self: SponsoredFountainDetailComponent = this;

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

      const loc = { type: 'Point', coordinates: [this.lng, this.lat] };
      values.loc = loc;
      this.isFormSaved = true;

      values.corporateId = values.corporateInfo._id

      this.updateFountain(this.fountainId, values);

    }
  }

  //
  // this method used to transform a sponsored fountain to private
  //
  showDialogRemoveSponsor(values) {
    const dialogRef = this.dialog.open(TransformSponsoredFountainToPrivateComponent, {
      width: '500px',
      height: '280px',
      disableClose: true,
      autoFocus: false,
      data: {
        // tslint:disable-next-line: max-line-length
        message: 'Seleccione el nuevo tipo de fuente',
        confirmation: ' (tras este cambio la fuente conservará el nombre de la marca, es recomendable cambiarlo)'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let valuesFountain;
        valuesFountain = Object.assign({}, this.fountain);

        valuesFountain.fountainType = result;

        if (valuesFountain.brandInfo) {
          delete valuesFountain.brandInfo;
        }
        if (valuesFountain.imageInfo) {
          delete valuesFountain.imageInfo;
        }
        if (valuesFountain.userInfo) {
          delete valuesFountain.userInfo;
        }
        if (valuesFountain.imageInfo) {
          delete valuesFountain.imageInfo;
        }
        if (valuesFountain.mapPinImageInfo) {
          delete valuesFountain.mapPinImageInfo;
        }

        if (valuesFountain.brandId) {
          delete valuesFountain.brandId;
        }
        if (valuesFountain.mapPinImageId) {
          delete valuesFountain.mapPinImageId;
        }

        this.fountainService
          .updateComplete(this.fountainId, valuesFountain, { 'Accept-language': 'es' })
          .subscribe((response) => {

            this.toastr.success('Fuente actualizada con éxito', 'Listo');
            this.router.navigate([this.routerDefinitions.sponsoredFountains, 'list']);
          },
            error => {
              this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
            });
      }
    });
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
            if (this.mapPinImageUploaderInput) {
              this.mapPinImageUploaderInput.nativeElement.value = '';
            }
            this.isMapPinImageDeleted = true;
            this.isMapPinLocalImageChanged = true;
            this.mapPinImageUploader.clearQueue();
            if (this.mapPinImageId) {
              this.mapPinImageId = null;
            }
            break;
          case this.fountainImageUploader:
            this.fountainLocalImage = '';
            if (this.fountainImageUploaderInput) {
              this.fountainImageUploaderInput.nativeElement.value = '';
            }
            this.isFountainImageDeleted = true;
            this.isFountainLocalImageChanged = true;
            this.fountainImageUploader.clearQueue();
            if (this.imageId) {
              this.imageId = null;
            }
            break;
        }
        this.fountainForm.markAsDirty();
      }
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

      // jsonResponse[0]._id = mapPinImageId
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
      // this.assignImageToFountain(mapPinImageId, jsonResponse[0]._id);
    }

    this.fountainImageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      // jsonResponse[0]._id = fountainImageId;

      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToFountain(mapPinImageId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
      }
    };
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
        // ALL
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

  updateFountain(fountainId: string, values) {
    this.fountainService
      .getById(fountainId)
      .subscribe(
        (fountain: Fountain) => {
          this.fountain = fountain;


          // Values to Update
          let valuesFountain: any;

          valuesFountain = Object.assign({}, this.fountain);


          if (valuesFountain.brandInfo) {
            delete valuesFountain.brandInfo;
          }
          if (valuesFountain.imageInfo) {
            delete valuesFountain.imageInfo;
          }
          if (valuesFountain.userInfo) {
            delete valuesFountain.userInfo;
          }
          if (valuesFountain.imageInfo) {
            delete valuesFountain.imageInfo;
          }
          if (valuesFountain.mapPinImageInfo) {
            delete valuesFountain.mapPinImageInfo;
          }

          // delete img
          if (this.imageId === null && this.fountainImageUploader.queue.length === 0) {
            if (valuesFountain.imageId) {
              delete valuesFountain.imageId;
            }
          }
          // delete pin
          if (this.mapPinImageId === null && this.mapPinImageUploader.queue.length === 0) {
            if (valuesFountain.mapPinImageId) {
              delete valuesFountain.mapPinImageId;
            }
          }

          // valuesToUpdate = fountainValues + formValues;
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

          valuesToUpdate.corporateId = values.corporateId;

          this.fountainService
            .updateComplete(fountainId, valuesToUpdate, { 'Accept-language': 'es' })
            .subscribe(
              (response) => {
                this.ngxLoader.start();
                this.mapPinUploadImage();
              },
              error => {
                this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
              });
        },
        error => {
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        }
      );
  }

  //
  // Method used to search with geoCode and change values of geoInfo/address/lat&lng
  //
  markerDragEnd(event: any) {

    const self: SponsoredFountainDetailComponent = this;
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
