import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductTypesService } from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-product-type-detail',
  templateUrl: './product-type-detail.component.html',
  styleUrls: ['./product-type-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductTypeDetailComponent implements OnInit {
  action: string;
  productTypeId: string;
  productTypeForm: UntypedFormGroup;
  productType;

  routerDefinitions = ROUTER_DEFINITIONS;

  isFormSaved = false;
  isFormCanceled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private productTypeService: ProductTypesService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private ngxLoader: NgxUiLoaderService,
    private _location: Location
  ) {
    this.action = this.activatedRoute.snapshot.url[0].path;
    this.productTypeId = this.activatedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.getProductTypeById();
        break;

      case 'edit':
        this.buildForm(false);
        this.getProductTypeById();
        break;

      case 'new':
        this.buildForm(false);
        break;
    }
   }

  ngOnInit() {
  }

  navigateBack() {
    this._location.back();
  }

  buildForm(disabled) {
    this.productTypeForm = this.formBuilder.group({
      name: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }, Validators.required],
        en: [{ value: null, disabled: disabled }, Validators.required]
      }),
      description: this.formBuilder.group({
        es: [{ value: null, disabled: disabled }],
        en: [{ value: null, disabled: disabled }]
      })
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.productTypeForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  getProductTypeById() {
    this.ngxLoader.start();
    this.productTypeService
    .getById(this.productTypeId)
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.productType = response;
      this.productTypeForm.patchValue(response);
    },
    error => {
      this.ngxLoader.stop();
      this.toastr.error('Ha ocurrido un error al obtener el tipo de producto', 'Error');
    });
  }

  saveForm(values, valid) {
    if (valid) {
      this.isFormSaved = true;

      if (this.action === 'new') {
        this.createProductType(values);
      } else {
        this.editProductType(values);
      }
    }
  }

  checkSpanish() {
    if (this.productTypeForm.get('name').get('es').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  checkEnglish() {
    if (this.productTypeForm.get('name').get('en').invalid) {
      return '*';
    } else {
      return '';
    }
  }

  createProductType(values) {
    this.ngxLoader.start();
    this.productTypeService
    .create(values)
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.toastr.success('El tipo de producto se ha creado correctamente', 'Listo');
      this.router.navigate([this.routerDefinitions.productTypes + '/list']);
    },
    error => {
      this.ngxLoader.stop();
      this.toastr.error('Ha ocurrido un error al crear el tipo de producto', 'Error');
    });
  }

  editProductType(values) {
    this.ngxLoader.start();
    this.productTypeService
    .editProductType(this.productTypeId, values)
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.toastr.success('El tipo de producto se ha editado correctamente', 'Listo');
      this.router.navigate([this.routerDefinitions.productTypes + '/list']);
    },
    error => {
      this.ngxLoader.stop();
      this.toastr.error('Ha ocurrido un error al editar el tipo de producto', 'Error');
    });
  }

}
