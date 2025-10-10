import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@tyris/angular-foundation';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChallengeCsvResponseDialogComponent } from 'src/app/shared/components/challenge-csv-response-dialog/challenge-csv-response-dialog.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import {
  PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES,
  S3_URL
} from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Fountain } from 'src/app/shared/custom-gnommo-base/models';
import {
  ChallengeService,
  ChallengeSubscriptionService,
  CorporateService,
  FountainService,
  ProductService
} from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  selector: 'app-challenge-detail',
  styleUrls: ['./challenge-detail.component.scss'],
  templateUrl: 'challenge-detail.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ChallengeDetailComponent implements OnInit {
  action: string;
  changeDate: boolean;
  challengeId;
  challengeForm: UntypedFormGroup;
  imagesForm: UntypedFormGroup;
  filterForm: UntypedFormGroup;
  challengeCSVForm: UntypedFormGroup;
  challenge;
  fountains;
  corporates;
  products;
  challenges;

  corporateSelected;

  gamificationEnabled: boolean = false;

  // Este booleano lo usaremos para controlar en que estado de privado estaba el objeto cuando nos vino de la api
  staticPrivate: boolean;

  private: string = 'PUBLIC';
  privateTypeSelected;

  // ADD or DELETE
  userTargetCSVMode: string = "ADD";
  // Booleano para controlar si se ha subido el csv de usuarios para mostrar el mensaje
  csvUpdated: boolean = false;

  subscribeCSVMode: string = "ADD";

  // Variables para el resumen del procesamiento del csv
  successUsersCSV = 0
  failUsersCSV = 0
  previousUsersCSV = 0

  privateTypes = [
    { key: "DATE", value: "Fecha Registro" },
    { key: "USERS", value: "Target Usuarios" }
  ];

  editorConfig: AngularEditorConfig;

  // UPLOADERS
  public challengeImageUploader: FileUploader = new FileUploader({ url: '' });
  public challengeBackgroundImageUploader: FileUploader = new FileUploader({
    url: ''
  });
  public usersTargetCSVUploader: FileUploader = new FileUploader({
    url: '',
    queueLimit: 1
  });

  public subscribeUsersCSVUploader: FileUploader = new FileUploader({
    url: '',
    queueLimit: 1
  });

  @ViewChild('usersTargetCSVUploaderInput') usersTargetCSVUploaderInput: ElementRef;
  @ViewChild('subscribeUsersCSVUploaderInput') subscribeUsersCSVUploaderInput: ElementRef;

  // IMAGE
  challengeImageId: string;
  isChallengeImageDeleted = false;
  @ViewChild('challengeImageUploaderInput')
  challengeImageUploaderInput: ElementRef;

  // LOCAL IMAGE
  isChallengeLocalImageChanged = false;
  challengeLocalImage = '';

  // BACKGROUND IMAGE
  challengeBackgroundImageId: string;
  isChallengeBackgroundImageDeleted = false;
  @ViewChild('challengeBackgroundImageUploaderInput')
  challengeBackgroundImageUploaderInput: ElementRef;

  // LOCAL BACKGROUND IMAGE
  isChallengeLocalBackgroundImageChanged = false;
  challengeLocalBackgroundImage = '';

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  // START FOUNTAINS
  displayedColumns: string[] = ['title', 'type', 'address', 'manageFountains'];

  // PAGINATOR

  paginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };

  filter: any = {};

  // tslint:disable-next-line:max-line-length
  fountainTypes = [
    ...[{ name: 'Todos', value: '' }],
    ...PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES,
    ...[{ name: 'Patrocinada', value: 'SPONSORED' }]
  ];

  selectedFountains: Fountain[] = [];
  // END FOUNTAINS

  type = { value: "HABIT" };

  role;
  corporateId;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private challengeService: ChallengeService,
    private challengeSubscriptionService: ChallengeSubscriptionService,
    private fountainService: FountainService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private _location: Location,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private corporateService: CorporateService,
    private productService: ProductService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId();

    this.filter = `{"fountainStatus": { $eq: "ACTIVE"}, "corporateId": ObjectId("` + this.corporateId + `")}`;

    this.action = this.activatedRoute.snapshot.url[0].path;
    this.editorConfig = {
      editable: this.action !== 'view',
      spellcheck: true,
      height: '15rem',
      minHeight: '15rem',
      placeholder: 'Descripción',
      defaultFontName: 'Arial'
    };

    this.challengeId = this.activatedRoute.snapshot.params['id'];
    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getChallengeById(this.challengeId);
        this.getCorporates();
        this.getChallenges();
        this.displayedColumns = ['title', 'type', 'address'];
        break;
      case 'edit':
        this.buildForm(false);
        this.challengeForm.get('type').disable();
        this.getChallengeById(this.challengeId);
        this.getCorporates();
        this.getChallenges();
        break;
      case 'new':
        this.buildForm(false);
        // if (this.role == "MANAGER") {
        this.getProductsByCorporate(this.corporateId)
        // }
        this.getCorporates();
        this.getChallenges();
    }

    if (this.action !== 'view') {
      this.getFountains();
      this.countFountains();
    }
  }

  ngOnInit() {
    this.onChanges();

    this.filterForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
      this.createFilter(values);
      this.resetPaginate();
      this.countFountains();
    });

    this.handlerUploaders();
  }

  handlerUploaders() {
    if (this.challengeImageUploader.queue.length > 1) {
      this.challengeImageUploader.queue.splice(0, 1);
    }

    if (this.challengeBackgroundImageUploader.queue.length > 1) {
      this.challengeBackgroundImageUploader.queue.splice(0, 1);
    }

    this.challengeImageUploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.challengeImageUploader.onAfterAddingFile = file => {
      const fileExtension = '.' + file.file.name.split('.').pop();
      file.file.name =
        'challenge_image_' + new Date().getTime() + fileExtension;
    };

    this.challengeBackgroundImageUploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
      item.alias = 'attachments';
    };

    this.challengeBackgroundImageUploader.onAfterAddingFile = file => {
      const fileExtension = '.' + file.file.name.split('.').pop();
      file.file.name =
        'challenge_background_' + new Date().getTime() + fileExtension;
    };
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.challengeForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  navigateBack() {
    this._location.back();
  }

  onChanges() {
    this.challengeForm.valueChanges.subscribe(val => {
      if (val.type === 'HABIT') {
        this.challengeForm.get('duration').setValidators(Validators.required);
        this.challengeForm.get('closcaPoints').setValidators(Validators.required);
      } else if (val.type === 'LOCATION') {
        this.challengeForm.get('closcaPoints').setValidators(Validators.required);
        this.challengeForm.get('duration').clearValidators();
        // this.challengeForm.get('duration').setValue(1);
      } else if (val.type === 'LIMITED_WINNERS') {
        this.challengeForm.get('duration').clearValidators();
        // this.challengeForm.get('duration').setValue(1);
        this.challengeForm.get('closcaPoints').clearValidators();
      }

      // if (val.status === 'FINISHED') {
      //   this.challengeForm.get('status').disable();
      // }

      this.checkSpanish();
      this.checkEnglish();
    });
  }

  buildForm(disabled) {
    let typeValue = null
    let privateValue = null

    this.staticPrivate = false;
    this.private = 'PUBLIC';
    privateValue = this.private;

    if (this.role == "MANAGER") {
      this.type.value = "LIMITED_WINNERS"
      typeValue = this.type.value
    } else {
      this.type.value = "HABIT"
      typeValue = this.type.value
    }

    this.challengeForm = this.formBuilder.group({
      name: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      type: [{ value: typeValue, disabled: disabled }],
      duration: [{ value: null, disabled: disabled }],
      privateKey: [{ value: privateValue, disabled: disabled }],
      privateType: [{ value: null, disabled: disabled }],
      daysFromUserCreate: [{ value: null, disabled: disabled }],
      daysActive: [{ value: null, disabled: disabled }],
      usersAccessCount: [{ value: null, disabled: true }],
      closcaPoints: [{ value: null, disabled: disabled }],
      fillsNeeded: [{ value: null, disabled: disabled }],
      hydrationFillsNeeded: [{ value: null, disabled: disabled }],
      fountainsCreatedNeeded: [{ value: null, disabled: disabled }],
      fountainsRatedNeeded: [{ value: null, disabled: disabled }],
      startDate: [{ value: null, disabled: disabled }],
      endDate: [{ value: null, disabled: disabled }],
      description: this.formBuilder.group({
        es: [{ value: null, disabled: false }, Validators.required],
        en: [{ value: null, disabled: false }, Validators.required]
      }),
      status: [{ value: null, disabled: disabled }, [Validators.required]],
      instance: this.formBuilder.group({
        status: [
          { value: 'ACTIVE', disabled: disabled },
          [Validators.required]
        ],
        createdAt: [{ value: null, disabled: false }],
        modifiedAt: [{ value: null, disabled: false }]
      }),
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: this.action !== 'new' }],
        code: [{ value: null, disabled: true }]
      }),
      productReward: [{ value: null, disabled: disabled }],
      productRewardInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
      }),
      private: [{ value: null, disabled: disabled }],
      notifyUsersTarget: [{ value: false, disabled: disabled }],
      nextChallengeSubscribeWhenFail: [{ value: null, disabled: disabled }],
      nextChallengeTargetWhenFail: [{ value: null, disabled: disabled }],
      nextChallengeSubscribeWhenDone: [{ value: null, disabled: disabled }],
      nextChallengeTargetWhenDone: [{ value: null, disabled: disabled }]
    });

    this.imagesForm = this.formBuilder.group({
      imageId: [{ value: null, disabled: disabled }],
      backgroundId: [{ value: null, disabled: disabled }],
      private: [{ value: null, disabled: disabled }],
      fillsNeeded: [{ value: null, disabled: disabled }],
      hydrationFillsNeeded: [{ value: null, disabled: disabled }],
      fountainsCreatedNeeded: [{ value: null, disabled: disabled }],
      fountainsRatedNeeded: [{ value: null, disabled: disabled }],
    });

    this.challengeCSVForm = this.formBuilder.group({
      _id: [{ value: null, disabled: false }],
      notifyUsersSuscribed: [{ value: false, disabled: disabled }]
    });

    this.filterForm = this.formBuilder.group({
      name: [],
      fountainType: [],
      address: [],
      fountainStatus: []
    });
  }

  checkSpanish() {
    // Check for any invalid spanish controls
    if (this.challengeForm.get('name').get('es').invalid) {
      return '*';
    } else if (this.challengeForm.get('description').get('es').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  checkEnglish() {
    // Check for any invalid english controls
    if (this.challengeForm.get('name').get('en').invalid) {
      return '*';
    } else if (this.challengeForm.get('description').get('en').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  getChallengeById(challengeId: string) {
    this.challengeService.getById(challengeId).subscribe((challenge: any) => {
      if (challenge.fountains) {
        this.selectedFountains = challenge.fountainsInfo;
      }

      this.challenge = challenge;

      if (this.challenge.private != undefined) {
        this.staticPrivate = this.challenge.private;

        if (this.challenge.private) {
          this.private = 'PRIVATE';
        } else {
          this.private = 'PUBLIC';
        }

      } else {
        this.staticPrivate = false;
        this.private = 'PUBLIC';
      }

      if (this.challenge.status == "ACTIVE") {
        this.challengeForm.get('productRewardInfo').disable();
      }

      this.type.value = this.challenge.type

      this.challengeForm.get('privateKey').setValue(this.private);

      this.privateTypeSelected = this.challenge.privateType
      this.challengeImageId = challenge.imageId;
      this.challengeBackgroundImageId = challenge.backgroundId;

      this.challengeForm.patchValue(challenge);

      this.challengeCSVForm.patchValue(challenge);

      if (challenge.nextChallengeSubscribeWhenFail != undefined || challenge.nextChallengeTargetWhenFail != undefined || challenge.nextChallengeSubscribeWhenDone != undefined || challenge.nextChallengeTargetWhenDone != undefined) {
        this.gamificationEnabled = true
      } else {
        this.gamificationEnabled = false
      }

      this.challengeForm
        .get('startDate')
        .setValue(new Date(challenge.startDate));
      this.challengeForm.get('endDate').setValue(new Date(challenge.endDate));

      this.getProductsByCorporate(this.challenge.corporateId)
    });
  }

  getProductsByCorporate(corporateId) {
    this.ngxLoader.start();

    const headers = {
      filter: '{"corporateId": ObjectId("' + corporateId + '")}'
    };

    this.productService.getAll(headers).subscribe(response => {
      this.ngxLoader.stop();

      this.products = [];

      if (response !== null) {
        this.products = response;
      }
    },
      error => {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un error al intentar obtener la lista de productos',
          'Error'
        );
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

  getChallenges() {
    const headers = {
      filter: this.filter
    }

    this.challengeService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.challenges = [];
        if (response !== null) {
          this.challenges = response;
          this.challenges.unshift({ _id: undefined, name: { es: undefined } })
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  corporateChange(event) {
    this.corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.challengeForm.controls['corporateInfo'].get('code').setValue(this.corporateSelected.code);

    if (this.corporateSelected.code != "CLOSCA") {
      this.challengeForm.get('type').setValue("LIMITED_WINNERS")
      this.type.value = "LIMITED_WINNERS"
      // this.challengeForm.get('type').disable();
    }
    // else {
    //   this.challengeForm.get('type').enable();
    // }

    this.getProductsByCorporate(this.corporateSelected._id)
  }

  productChange(event) {
    let productSelected = this.products.filter(product => product._id === event.value)[0]
    this.challengeForm.controls['productRewardInfo'].get('_id').setValue(productSelected._id);
  }

  privateTypeChange(event) {
    this.privateTypeSelected = event.value
    this.challengeForm.get('privateType').setValue(this.privateTypeSelected);
  }

  privateChange(value) {
    this.private = value
  }

  typeChange(value) {
    this.type.value = value;
  }

  dateChange() {
    this.changeDate = true;
  }

  saveForm(values, valid) {

    if ((values.fillsNeeded == null || values.fillsNeeded == 0)
      && (values.hydrationFillsNeeded == null || values.hydrationFillsNeeded == 0)
      && (values.fountainsCreatedNeeded == null || values.fountainsCreatedNeeded == 0)
      && (values.fountainsRatedNeeded == null || values.fountainsRatedNeeded == 0)) {

      this.toastr.error(
        'Debes seleccionar, al menos, un requisito para el reto',
        'Aviso'
      );

      return;
    }

    // Cambiamos el private de string a bool
    if (values.privateKey === 'PRIVATE') {
      values.private = true;
    } else {
      values.private = false;
    }

    delete values.usersAccessCount;

    if (this.gamificationEnabled) {
      if (values.nextChallengeSubscribeWhenFail == undefined && values.nextChallengeTargetWhenFail == undefined && values.nextChallengeSubscribeWhenDone == undefined && values.nextChallengeTargetWhenDone == undefined) {
        this.toastr.error(
          'Debes seleccionar, al menos, un reto para el Programa de Gamificación',
          'Aviso'
        );

        return;
      }

      if (values.nextChallengeSubscribeWhenFail == undefined) {
        delete values.nextChallengeSubscribeWhenFail
      }

      if (values.nextChallengeTargetWhenFail == undefined) {
        delete values.nextChallengeTargetWhenFail
      }

      if (values.nextChallengeSubscribeWhenDone == undefined) {
        delete values.nextChallengeSubscribeWhenDone
      }

      if (values.nextChallengeTargetWhenDone == undefined) {
        delete values.nextChallengeTargetWhenDone
      }

    } else {
      delete values.nextChallengeSubscribeWhenFail
      delete values.nextChallengeTargetWhenFail
      delete values.nextChallengeSubscribeWhenDone
      delete values.nextChallengeTargetWhenDone
    }

    if (this.action === 'edit') {
      values.type = this.type.value;

      // tslint:disable-next-line: max-line-length
      if (
        this.challenge.totalSubscriptions > 0 &&
        this.changeDate &&
        (values.startDate > moment().valueOf() ||
          values.endDate < moment().valueOf())
      ) {
        this.toastr.error(
          'La fecha del reto debe incluir el día de hoy',
          'Aviso'
        );
      } else {
        const startDate = this.challengeForm.getRawValue().startDate;
        const endDate = this.challengeForm.getRawValue().endDate;

        values.startDate = moment(startDate)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toDate()
          .getTime();
        values.endDate = moment(endDate)
          .set({ hour: 23, minute: 59, second: 0, millisecond: 0 })
          .toDate()
          .getTime();

        const fountainsIdsToSave = [];

        this.selectedFountains.forEach(fountain => {
          fountainsIdsToSave.push(fountain._id);
        });

        values.fountains = fountainsIdsToSave;

        if (values.private) {
          // Si es privado, comprobabos el tipo de privado
          switch (values.privateType) {
            case 'USERS':
              // Miramos si el CSV se ha subido
              if (this.challenge.privateType == "USERS") {
                valid = true
              } else if (this.usersTargetCSVUploader.queue.length > 0) {
                valid = true
              } else {
                valid = false
              }

              if (!valid) {
                this.toastr.error(
                  'Debes subir un csv con los usuarios',
                  'Aviso'
                );
              }

              break;
            case 'DATE':
              // Miramos si los campos de los dias estan en nulo
              valid = values.daysFromUserCreate != null && values.daysActive != null;

              if (!valid) {
                this.toastr.error(
                  'Debes seleccionar un dia de inicio y de fin para la visualización reto',
                  'Aviso'
                );
              }

              break;
          }
        }

        if (valid) {
          this.isFormSaved = true;
          this.updateChallenge(this.challengeId, values);
        }
      }
    }

    if (this.action === 'new') {
      if (values.type) {
        if (values.type === 'LIMITED_WINNERS' && values.productRewardInfo._id === null) {
          this.toastr.error('Debes seleccionar un producto de recompensa', 'Aviso');
          return
        }

        if (values.type === 'LOCATION' || values.type === 'LIMITED_WINNERS') {
          delete values.duration;

          const startDate = this.challengeForm.getRawValue().startDate;
          const endDate = this.challengeForm.getRawValue().endDate;

          if (startDate != null && endDate != null) {
            values.startDate = moment(startDate)
              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
              .toDate()
              .getTime();
            values.endDate = moment(endDate)
              .set({ hour: 23, minute: 59, second: 0, millisecond: 0 })
              .toDate()
              .getTime();

            if (values.type === 'LOCATION') {
              const fountainsIdsToSave = [];

              this.selectedFountains.forEach(fountain => {
                fountainsIdsToSave.push(fountain._id);
              });

              values.fountains = fountainsIdsToSave;
            } else {
              values.productReward = values.productRewardInfo._id
              delete values.productRewardInfo
            }
          } else {
            valid = false;
            this.toastr.error(
              'Debes seleccionar una fecha de inicio y de fin para el reto',
              'Aviso'
            );
          }
        }

        if (values.private) {
          // Si es privado, comprobabos el tipo de privado
          switch (values.privateType) {
            case 'USERS':
              // Miramos si el CSV se ha subido
              valid = this.usersTargetCSVUploader.queue.length > 0;

              if (!valid) {
                this.toastr.error(
                  'Debes subir un csv con los usuarios',
                  'Aviso'
                );
              }

              break;
            case 'DATE':
              // Miramos si los campos de los dias estan en nulo
              valid = values.daysFromUserCreate != null && values.daysActive != null;

              if (!valid) {
                this.toastr.error(
                  'Debes seleccionar un dia de inicio y de fin para la visualización reto',
                  'Aviso'
                );
              }

              break;
          }
        }

        if (valid) {
          this.isFormSaved = true;

          if (this.role == "MANAGER") {
            values.corporateId = this.corporateId
          } else {
            values.corporateId = values.corporateInfo._id
          }

          this.createChallenge(values);
        }
      } else {
        this.toastr.error('Debes seleccionar un tipo de reto', 'Aviso');
      }
    }
  }

  createChallenge(values) {
    values.instance.createdAt = new Date().getTime();
    values.instance.modifiedAt = new Date().getTime();
    if (values.endDate < values.startDate) {
      this.toastr.error(
        'La fecha de finalización del reto no puede ser anterior a la de inicio',
        'Aviso'
      );
    } else {

      let usersFile = null;

      if (this.usersTargetCSVUploader.queue.length > 0) {
        usersFile = this.usersTargetCSVUploader.queue[this.usersTargetCSVUploader.queue.length - 1]
          .file.rawFile;
        usersFile = usersFile.slice(0, usersFile.size, 'text/csv');
      }

      const challengeFormData = new FormData();

      // El orden es importante, si tiene csv, debe ir primero para back
      if (usersFile !== null) {
        this.csvUpdated = true
        challengeFormData.append('csv', usersFile);
      } else {
        this.csvUpdated = false
      }

      challengeFormData.append('challenge', JSON.stringify(values));

      this.challengeService.createMultipart(challengeFormData).subscribe(
        response => {
          this.successUsersCSV = response.successUsers
          this.failUsersCSV = response.failUsers
          this.previousUsersCSV = response.previousUsers

          this.challengeId = response._id;
          this.ngxLoader.start();
          this.challengeUploadBackgroundImage();
        },
        error => {
          this.toastr.error('Ha ocurrido un problema al crear el reto', 'Error');
        }
      );

    }
  }

  updateChallenge(challengeId: string, values) {
    if (values.type === 'LOCATION' || values.type === 'LIMITED_WINNERS') {
      values.instance.createdAt = this.challenge.instance.createdAt;
      values.instance.modifiedAt = new Date().getTime();
    }

    let usersFile = null;

    if (this.usersTargetCSVUploader.queue.length > 0) {
      usersFile = this.usersTargetCSVUploader.queue[this.usersTargetCSVUploader.queue.length - 1]
        .file.rawFile;
      usersFile = usersFile.slice(0, usersFile.size, 'text/csv');
    }

    const challengeFormData = new FormData();

    // El orden es importante, si tiene csv, debe ir primero para back
    if (usersFile !== null) {
      this.csvUpdated = true
      challengeFormData.append('csv', usersFile);
    } else {
      this.csvUpdated = false
    }

    challengeFormData.append('challenge', JSON.stringify(values));

    this.challengeService
      .updateMultipart(challengeId, challengeFormData, this.userTargetCSVMode)
      .subscribe(
        response => {
          this.successUsersCSV = response.successUsers
          this.failUsersCSV = response.failUsers
          this.previousUsersCSV = response.previousUsers

          this.ngxLoader.start();
          this.challengeUploadBackgroundImage();
          if (
            values.type === 'HABIT' &&
            values.status !== this.challenge.status
          ) {
            this.pauseChallenge();
          }
        },
        error => {
          this.toastr.error(
            'Ha ocurrido un problema al actualizar el reto',
            'Error'
          );
        }
      );
  }

  resumeUserTargetCSVDialog(successUsers, failUsers, previousUsers, userTargetCSVMode) {
    var title = "Resumen CSV"
    var message = ""
    switch (userTargetCSVMode) {
      case 'ADD':
        message =
          'Número de nuevos usuarios que se les ha habilitado el reto: ' + successUsers +
          '<br/><br/>Número de registros que no se les ha podido habilitar el reto: ' + failUsers +
          '<br/><br/>Número de usuarios asignados previamente: ' + previousUsers;
        break;
      case 'DELETE':
        message =
          'Número de usuarios a los que se les ha ocultado el reto: ' + successUsers +
          '<br/><br/>Número de registros que no se han podido procesar: ' + failUsers;

    };

    const dialogRef = this.dialog.open(ChallengeCsvResponseDialogComponent, {
      width: '388px',
      height: 'auto',
      disableClose: true,
      autoFocus: false,
      data: {
        title: title,
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate([this.routerDefinitions.challenges, 'list']);
      }
    });
  }

  resumeSubscribeUsersCSVDialog(successUsers, failUsers, previousUsers, subscibeUsersCSVMode) {
    var title = "Resumen CSV"
    var message = ""
    switch (subscibeUsersCSVMode) {
      case 'ADD':
        message =
          'Número de nuevos usuarios añadidos al reto: ' + successUsers +
          '<br/><br/>Número de registros que no se han podido procesar: ' + failUsers +
          '<br/><br/>Número de usuarios duplicados: ' + previousUsers;
        break;
      case 'DELETE':
        message =
          'Número de nuevos usuarios eliminados del reto: ' + successUsers +
          '<br/><br/>Número de registros que no se han podido procesar: ' + failUsers;

    };

    const dialogRef = this.dialog.open(ChallengeCsvResponseDialogComponent, {
      width: '388px',
      height: 'auto',
      disableClose: true,
      autoFocus: false,
      data: {
        title: title,
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate([this.routerDefinitions.challenges, 'list']);
      }
    });
  }

  pauseChallenge() {
    this.challengeService.pause(this.challengeId).subscribe();
  }

  // 1. Upload background img
  challengeUploadBackgroundImage() {
    this.challengeBackgroundImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'background-challenges' }
      ]
    });

    if (this.challengeBackgroundImageUploader.queue.length > 0) {
      this.challengeBackgroundImageUploader.uploadAll();
    } else {
      this.challengeUploadImage();
    }

    this.challengeBackgroundImageUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.challengeUploadImage(jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un problema al actualizar el reto',
          'Error'
        );
      }
    };
  }

  // 2. Upload challenge img and assign img to users.

  challengeUploadImage(backgroundImageId?) {
    this.challengeImageUploader.setOptions({
      url: `${environment.apiUrl}/images`,
      authToken: `Bearer ${this.authService.getToken().id}`,
      headers: [
        { name: 'Accept', value: 'application/json' },
        { name: 'Accept-language', value: 'es' },
        { name: 'destination', value: 'challenges' }
      ]
    });

    if (this.challengeImageUploader.queue.length > 0) {
      this.challengeImageUploader.uploadAll();
    } else {
      this.assignImageToChallenge(backgroundImageId);
    }

    this.challengeImageUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 200) {
        const jsonResponse = JSON.parse(response);
        this.assignImageToChallenge(backgroundImageId, jsonResponse[0]._id);
      } else {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un problema al actualizar el reto',
          'Error'
        );
      }
    };
  }

  assignImageToChallenge(backgroundId?: string, imageId?: string) {

    if (!backgroundId && !imageId) {
      // No img to assign
      this.ngxLoader.stop();

      if (this.csvUpdated) {
        this.csvUpdated = false
        this.resumeUserTargetCSVDialog(this.successUsersCSV, this.failUsersCSV, this.previousUsersCSV, this.userTargetCSVMode);
      } else {
        this.router.navigate([this.routerDefinitions.challenges, 'list']);
        if (this.action === 'new') {
          this.toastr.success('Reto creado con exito', 'Listo');
        } else {
          this.toastr.success('Reto actualizado con exito', 'Listo');
        }
      }

    } else {
      // Assign challengeImg / backgroundImg to challenge

      if (!backgroundId && imageId) {
        this.imagesForm.controls['imageId'].setValue(imageId);
      } else if (backgroundId && !imageId) {
        this.imagesForm.controls['backgroundId'].setValue(backgroundId);
      } else {
        this.imagesForm.controls['imageId'].setValue(imageId);
        this.imagesForm.controls['backgroundId'].setValue(backgroundId);
      }

      // Cambiamos el private de string a bool
      if (this.challengeForm.get('privateKey').value === 'PRIVATE') {
        this.imagesForm.controls['private'].setValue(true)
      } else {
        this.imagesForm.controls['private'].setValue(false)
      }

      this.imagesForm.controls['fillsNeeded'].setValue(this.challengeForm.get("fillsNeeded").value)
      this.imagesForm.controls['hydrationFillsNeeded'].setValue(this.challengeForm.get("hydrationFillsNeeded").value)
      this.imagesForm.controls['fountainsCreatedNeeded'].setValue(this.challengeForm.get("fountainsCreatedNeeded").value)
      this.imagesForm.controls['fountainsRatedNeeded'].setValue(this.challengeForm.get("fountainsRatedNeeded").value)

      // if (this.challengeForm.get("type").value == "LIMITED_WINNERS") {
      //   this.challengeForm.controls['productReward'].setValue(this.challengeForm.controls['productRewardInfo'].get('_id').value)
      // }

      this.challengeService
        .update(this.challengeId, this.imagesForm.value, { 'Accept-language': 'es' })
        .subscribe(
          response => {
            this.ngxLoader.stop();

            if (this.csvUpdated) {
              this.csvUpdated = false
              this.resumeUserTargetCSVDialog(this.successUsersCSV, this.failUsersCSV, this.previousUsersCSV, this.userTargetCSVMode);
            } else {
              this.router.navigate([this.routerDefinitions.challenges, 'list']);

              if (this.action === 'new') {
                this.toastr.success('Reto creado con exito', 'Listo');
              } else {
                this.toastr.success('Reto actualizado con exito', 'Listo');
              }
            }

          },
          error => {
            this.ngxLoader.stop();

            if (this.action === 'new') {
              this.toastr.error(
                'Ha ocurrido un problema al crear el reto',
                'Error'
              );
            } else {
              this.toastr.error(
                'Ha ocurrido un problema al actualizar el reto',
                'Error'
              );
            }
            this.router.navigate([this.routerDefinitions.challenges, 'list']);
          }
        );
    }
  }

  userTargetCSVModeChange(value) {
    this.userTargetCSVMode = value
  }

  subscribeCSVModeChange(value) {
    this.subscribeCSVMode = value
  }

  changeUserTargetCSVListener(files: FileList) {
    this.challengeForm.markAsDirty();

    if (files.length > 0) {
      const fileName = files[files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'csv' ||
        fileName.substr(fileName.length - 3) === 'CSV'
      ) {
      } else {
        this.usersTargetCSVUploaderInput.nativeElement.value = '';
        this.usersTargetCSVUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  changeSubscribeCSVListener(files: FileList) {

    if (files.length > 0) {
      const fileName = files[files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'csv' ||
        fileName.substr(fileName.length - 3) === 'CSV'
      ) {
      } else {
        this.subscribeUsersCSVUploaderInput.nativeElement.value = '';
        this.subscribeUsersCSVUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  uploadSubscribeCSV(event) {
    if (this.subscribeUsersCSVUploader.queue.length > 0) {
      this.ngxLoader.start();

      let usersFile = null;

      if (this.subscribeUsersCSVUploader.queue.length > 0) {
        usersFile = this.subscribeUsersCSVUploader.queue[this.subscribeUsersCSVUploader.queue.length - 1]
          .file.rawFile;
        usersFile = usersFile.slice(0, usersFile.size, 'text/csv');
      }

      const formData = new FormData();

      // El orden es importante, si tiene csv, debe ir primero para back
      if (usersFile !== null) {
        formData.append('csv', usersFile);
      }

      this.challengeCSVForm.get('_id').setValue(this.challenge._id);

      formData.append('challenge', JSON.stringify(this.challengeCSVForm.value));

      this.challengeSubscriptionService
        .uploadSubscribeCSV(this.challengeId, formData, this.subscribeCSVMode)
        .subscribe(
          response => {
            this.ngxLoader.stop();
            this.resumeSubscribeUsersCSVDialog(response.successUsers, response.failUsers, response.previousUsers, this.subscribeCSVMode);
          },
          error => {
            this.ngxLoader.stop();
            this.toastr.error(
              'Ha ocurrido un problema al suscribir los usuarios el reto',
              'Error'
            );
          }
        );
    } else {
      this.toastr.error(
        'Debes subir un csv con los usuarios',
        'Aviso'
      );
    }

  }

  changeLocalImage(event: any, type: string) {
    const self: ChallengeDetailComponent = this;
    this.challengeForm.markAsDirty();

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

          // Start background image
          if (type === 'background') {
            if (width <= 640 && height <= 288) {
              self
                .getBase64(event.target.files[event.target.files.length - 1])
                .then((image: string) => {
                  self.isChallengeLocalBackgroundImageChanged = true;
                  self.challengeLocalBackgroundImage = image;
                });
            } else {
              self.challengeBackgroundImageUploader.clearQueue();
              self.challengeBackgroundImageUploaderInput.nativeElement.value =
                '';
              self.toastr.error(
                'El tamaño excede del máximo permitido (640x288px)',
                'Error'
              );
            }

            // End background image
          } else {
            // Start challenge image
            if (width <= 100 && height <= 145) {
              self
                .getBase64(event.target.files[event.target.files.length - 1])
                .then((image: string) => {
                  self.isChallengeLocalImageChanged = true;
                  self.challengeLocalImage = image;
                });
            } else {
              self.challengeImageUploader.clearQueue();
              self.challengeImageUploaderInput.nativeElement.value = '';
              self.toastr.error(
                'El tamaño excede del máximo permitido (100x145px)',
                'Error'
              );
            }
            // End challenge image
          }
        };
      } else {
        if (type === 'background') {
          this.challengeBackgroundImageUploader.clearQueue();
          this.toastr.error('El formato del archivo no es compatible', 'Error');
        } else {
          this.challengeImageUploader.clearQueue();
          this.toastr.error('El formato del archivo no es compatible', 'Error');
        }
      }
    }
  }

  downloadUsersTargetCSV(event) {
    this.challengeService.getUsersTarget(this.challengeId).subscribe((usersTarget: [any]) => {
      this.exportCSVFile(["Correo", "Suscrito", "UserID"], usersTarget, "Usuarios_con_acceso");
    });
  }

  downloadUsersSubscribedCSV(event) {
    this.challengeSubscriptionService.getUsersSubscribed(this.challengeId).subscribe((usersSubscribed: [any]) => {
      let orderedUsersSubscribed = JSON.parse(JSON.stringify(usersSubscribed, ["userId", "email", "status", "subscribedAt", "finishedAt", "refills"], 4));

      this.exportCSVFile(["UserID", "Correo", "Estado del reto", "Fecha de unión (UTC +0:00)", "Fecha fin de participación (UTC +0:00)", "Número de refills"], orderedUsersSubscribed, "Usuarios_suscritos");
    });
  }

  exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
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
      data: {
        message: '¿Está seguro que desea eliminar la imagen seleccionada?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Start background image
        if (type === 'background') {
          this.challengeForm.markAsDirty();

          if (this.challengeBackgroundImageId) {
            this.challengeBackgroundImageId = null;
          }

          this.isChallengeBackgroundImageDeleted = true;
          this.isChallengeLocalBackgroundImageChanged = true;
          this.challengeLocalBackgroundImage = '';
          if (this.challengeBackgroundImageUploaderInput) {
            this.challengeBackgroundImageUploaderInput.nativeElement.value = '';
          }
          this.challengeBackgroundImageUploader.clearQueue();
          // End background image
        } else {
          // Start challenge image
          this.challengeForm.markAsDirty();

          if (this.challengeImageId) {
            this.challengeImageId = null;
          }

          this.isChallengeImageDeleted = true;
          this.isChallengeLocalImageChanged = true;
          this.challengeLocalImage = '';
          if (this.challengeImageUploaderInput) {
            this.challengeImageUploaderInput.nativeElement.value = '';
          }
          this.challengeImageUploader.clearQueue();
          // End challenge image
        }
      }
    });
  }

  //
  // START FOUNTAINS CODE
  //
  //
  //
  addFountainToChallenge(fountain) {
    const itemFound = this.selectedFountains.find(
      item => item._id === fountain._id
    );
    if (itemFound === undefined) {
      const auxFountainsSelected = [...this.selectedFountains];
      auxFountainsSelected.push(fountain);
      this.selectedFountains = auxFountainsSelected;
      this.challengeForm.markAsDirty();
    }
  }

  removeFountainToChallenge(fountain) {
    const auxFountains = this.selectedFountains.filter(
      item => item._id !== fountain._id
    );
    this.selectedFountains = auxFountains;
    this.challengeForm.markAsDirty();
  }

  openRemoveFountainDialog(fountain) {
    const message =
      '¿Está seguro que desea eliminar la fuente del listado de fuentes del reto?';
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '388px',
      height: 'auto',
      disableClose: true,
      autoFocus: false,
      data: { message: message }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeFountainToChallenge(fountain);
      }
    });
  }

  getFountains() {
    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: 'instance.createdAt',
      filter: this.filter
    };
    this.fountainService.getAll(headers).subscribe((fountains: Fountain[]) => {
      this.fountains = [];

      if (fountains) {
        this.fountains = fountains;
      }
    });
  }

  countFountains() {
    const headers = {
      filter: this.filter
    };
    this.fountainService.count(headers).subscribe(response => {
      if (response !== null) {
        this.paginator.length = 0;
        this.paginator.length = response.totalFountains;
      } else {
        this.paginator.length = 0;
      }
    });
  }

  createFilter(filterValues) {
    const startFilter = '{"fountainStatus": { $eq: "ACTIVE"}, "corporateId": ObjectId("' + this.corporateId + '")';
    const nameFilter =
      ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const fountainTypeFilter =
      ',"fountainType": "' + filterValues.fountainType + '"';
    const addressFilter =
      ',"address.address": {$regex:".*' +
      filterValues.address +
      '", $options: "i"}';
    const fountainStatusFilter =
      ',"fountainStatus": "' + filterValues.fountainStatus + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat(
        filterValues.name !== '' && filterValues.name !== null ? nameFilter : ''
      )
      .concat(
        filterValues.address !== '' && filterValues.address !== null
          ? addressFilter
          : ''
      )
      .concat(
        filterValues.fountainType !== '' &&
          filterValues.fountainType !== null &&
          filterValues.fountainType.length !== 0
          ? fountainTypeFilter
          : ''
      )
      // tslint:disable-next-line:max-line-length
      .concat(
        filterValues.fountainStatus !== '' &&
          filterValues.fountainStatus !== null &&
          filterValues.fountainStatus.length !== 0
          ? fountainStatusFilter
          : ''
      )
      .concat(finishFilter);
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

  //
  // END FOUNTAINS CODE
  //
  //

  // AUX Functions
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
}
