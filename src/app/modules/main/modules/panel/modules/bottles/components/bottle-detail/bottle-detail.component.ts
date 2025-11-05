import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '@tyris/angular-foundation';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BOTTLE_MATERIALS, BOTTLE_SIZES, S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { BottleType } from 'src/app/shared/custom-gnommo-base/models/bottle-type.model';
import { BottleService, BottleTypesService } from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  selector: 'app-bottle-detail',
  templateUrl: './bottle-detail.component.html',
  styleUrls: ['./bottle-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BottleDetailComponent implements OnInit {
  action: string;
  bottleId: string;
  bottleForm: UntypedFormGroup;
  bottle;
  bottleTypes;
  bottleTypeSelected = new BottleType("", "Sin tipo");

  // --> ROUTER DEFINITION
  routerDefinitions = ROUTER_DEFINITIONS;


  // ENUMS
  sizes = BOTTLE_SIZES;
  materials = BOTTLE_MATERIALS;

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
    private bottleService: BottleService,
    private bottleTypesService: BottleTypesService
  ) {
    this.dateAdapter.setLocale('es-es');
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.bottleId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'edit':
      // this.buildForm(false);
      // this.getBottleTypes();
      // this.getBottleById(this.bottleId);
      // break;
      case 'view':
        this.buildForm(true);
        this.getBottleTypes();
        this.getBottleById(this.bottleId);
        break;
      case 'new':
        this.buildForm(false);
        break;
    }
  }

  ngOnInit() {
    this.bottleForm.valueChanges.pipe(debounceTime(600)).subscribe(values => {
    });
  }

  navigateBack() {
    this._location.back();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.bottleForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  buildForm(disabled) {
    this.bottleForm = this.formBuilder.group({
      userInfo: this.formBuilder.group({
        userName: [{ value: null, disabled: true }],
        email: [{ value: null, disabled: true }],
        phoneNumber: [{ value: null, disabled: true }]
      }),
      name: [{ value: null, disabled: disabled }, Validators.required],
      serialNumber: [{ value: null, disabled: true }],
      bottleTypeInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        color: [{ value: null, disabled: true }]
      }),
      size: [{ value: null, disabled: disabled }],
      material: [{ value: null, disabled: disabled }]
    });
  }

  getBottleById(bottleId: string) {
    this.bottleService
      .getById(bottleId, { "Accept-language": "es" })
      .subscribe(
        (bottle: any) => {
          this.bottle = bottle;
          this.bottleForm.patchValue(bottle);

          if (bottle.bottleTypeInfo) {
            this.bottleTypeSelected = bottle.bottleTypeInfo
          } else {
            this.bottleTypeSelected = new BottleType("", "Sin tipo")
          }

        }
      );
  }

  getBottleTypes() {
    this.bottleTypesService
      .getAll({ "Accept-language": "es" })
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.bottleTypes = [];
        if (response !== null) {
          this.bottleTypes = response;
          this.bottleTypes.unshift(new BottleType("", "Sin tipo"));
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar los tipos de botella, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  bottleTypeChange(event) {
    this.bottleTypeSelected = this.bottleTypes.filter(bottleType => bottleType._id === event.value)[0]
    this.bottleForm.controls['bottleTypeInfo'].get('color').setValue(this.bottleTypeSelected.color);
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  // SAVE FORM
  saveForm(values, valid) {
    if (valid) {
      this.isFormSaved = true;

      delete values.bottleTypeInfo
      values.bottleTypeId = this.bottleTypeSelected._id

      // Si tiene algún tipo de botella seleccionado, quitamos el size y material
      if (this.bottleTypeSelected._id !== '') {
        delete values.size;
        delete values.material;
      } else {
        if (values.size == null || values.material == null) {
          this.toastr.error('Debes seleccionar un tamaño y un material', 'Error');
          return;
        }
      }

      switch (this.action) {
        case 'edit':
          this.updateBottle(this.bottleId, values);
          break;
      }
    }
  }

  updateBottle(bottleTypeId: string, values) {
    this.bottleService
      .updateBottle(bottleTypeId, values, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.start();
          this.router.navigate([this.routerDefinitions.bottles, 'list']);
          this.toastr.success('Botella actualizada con exito', 'Listo');
        },
        error => {
          this.toastr.error('Botella no actualizada con exito', 'Error');
        }
      );
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
