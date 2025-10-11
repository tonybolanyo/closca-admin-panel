import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@tyris/angular-foundation';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { DialogRewardCodesComponent } from 'src/app/shared/components/dialog-reward-codes/dialog-reward-codes.component';
import { PRODUCT_STATUSES, S3_URL } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import {
  CorporateService,
  ProductService,
  ProductTypesService
} from 'src/app/shared/custom-gnommo-base/services';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailComponent implements OnInit {
  action: string;
  productId: string;
  productForm: UntypedFormGroup;
  productESForm: UntypedFormGroup;
  productENForm: UntypedFormGroup;
  sizeES: UntypedFormArray;
  sizeEN: UntypedFormArray;
  rewardStepperES: UntypedFormArray;
  rewardStepperEN: UntypedFormArray;
  productStatus;
  product;
  totalPrice;
  corporates;
  corporateCodeSelected = "CLOSCA";

  routerDefinitions = ROUTER_DEFINITIONS;

  editorConfig: AngularEditorConfig;

  // Uploader
  public imageProductUploader: FileUploader = new FileUploader({ url: '' });
  public imageDescriptionUploader: FileUploader = new FileUploader({ url: '' });
  public codeUploader: FileUploader = new FileUploader({
    url: '',
    queueLimit: 1
  });

  productStatusOptions = PRODUCT_STATUSES;
  productTypesOptions;

  isFormSaved = false;
  isFormCanceled = false;

  // IMAGES
  productImageId: string;
  descriptionImages;
  isProductImageDeleted = false;
  isDescriptionImageDeleted = false;

  @ViewChild('productImageUploaderInput') imageProductUploaderInput: ElementRef;
  @ViewChild('descriptionImageUploaderInput')
  descriptionImageUploaderInput: ElementRef;
  @ViewChild('codeUploaderInput') codeUploaderInput: ElementRef;

  // LOCAL IMAGES
  isProductLocalImageChanged = false;
  areDescriptionLocalImagesChanged = false;
  productLocalImage = '';
  descriptionLocalImages = [];

  // IMAGES TO DELETE
  imagesToDelete = [];

  role;
  corporateId;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService,
    private productTypeService: ProductTypesService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private _location: Location,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()

    this.action = this.activatedRoute.snapshot.url[0].path;
    this.productId = this.activatedRoute.snapshot.params['id'];

    this.editorConfig = {
      editable: this.action !== 'view',
      spellcheck: true,
      height: '15rem',
      minHeight: '15rem',
      placeholder: 'Descripción',
      defaultFontName: 'Arial'
    };

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        this.buildSpanishForm(true);
        this.buildEnglishForm(true);
        this.getProductById();
        this.getCorporates();
        break;

      case 'edit':
        this.buildForm(false);
        this.buildSpanishForm(false);
        this.buildEnglishForm(false);
        this.getProductById();
        this.getCorporates();
        break;

      case 'new':
        this.buildForm(false);
        this.buildSpanishForm(false);
        this.buildEnglishForm(false);
        this.getCorporates();
        break;
    }
  }

  ngOnInit() {
    this.getProductTypes();
    this.onChanges();
    this.handlerUploaders();
  }

  handlerUploaders() {
    if (this.imageProductUploader.queue.length > 1) {
      this.imageProductUploader.queue.splice(0, 1);
    }

    this.imageProductUploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
      item.alias = 'image';
    };

    this.imageProductUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name = 'producto_' + new Date().getTime() + fileExtension;
    };

    this.imageDescriptionUploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
      item.alias = 'description';
    };

    this.imageDescriptionUploader.onAfterAddingFile = f => {
      const fileExtension = '.' + f.file.name.split('.').pop();
      f.file.name = 'descripcion_' + new Date().getTime() + fileExtension;
    };
  }

  navigateBack() {
    this._location.back();
  }

  onChanges() {
    this.productForm.valueChanges.subscribe(val => {
      if (val.discount > 0 && val.discount <= 100) {
        this.totalPrice = val.price - val.price * (val.discount / 100);
      } else {
        this.totalPrice = val.price;
      }
    });
  }

  buildForm(disabled) {
    // if (this.role == "MANAGER") {
    this.productForm = this.formBuilder.group({
      status: [{ value: 'INVISIBLE', disabled: disabled }],
      typeId: [{ value: null, disabled: disabled }, Validators.required],
      price: [{ value: null, disabled: disabled }],
      discount: [
        { value: null, disabled: disabled },
        [Validators.min(0), Validators.max(100)]
      ],
      corporateInfo: this.formBuilder.group({
        _id: [{ value: null, disabled: disabled }],
        code: [{ value: null, disabled: true }]
      })
    });
    // } else {
    //   this.productForm = this.formBuilder.group({
    //     status: [{ value: 'INVISIBLE', disabled: disabled }],
    //     typeId: [{ value: null, disabled: disabled }, Validators.required],
    //     price: [{ value: null, disabled: disabled }, Validators.required],
    //     discount: [
    //       { value: null, disabled: disabled },
    //       [Validators.min(0), Validators.max(100)]
    //     ],
    //     corporateInfo: this.formBuilder.group({
    //       _id: [{ value: null, disabled: disabled }],
    //       code: [{ value: null, disabled: true }]
    //     })
    //   });
    // }

  }

  buildSpanishForm(disabled) {
    this.productESForm = this.formBuilder.group({
      name: [{ value: null, disabled: disabled }, Validators.required],
      description: [{ value: null, disabled: disabled }, Validators.required],
      size: this.formBuilder.array([this.createSize(disabled)]),
      rewardStepper: this.formBuilder.array([this.createCode(disabled)])
    });
  }

  buildEnglishForm(disabled) {
    this.productENForm = this.formBuilder.group({
      name: [{ value: null, disabled: disabled }, Validators.required],
      description: [{ value: null, disabled: disabled }, Validators.required],
      size: this.formBuilder.array([this.createSize(disabled)]),
      rewardStepper: this.formBuilder.array([this.createCode(disabled)])
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isFormCanceled && !this.isFormSaved && this.productForm.dirty) {
      return this.canDeactivateDialogService.openDialog();
    }
    return true;
  }

  createSize(disabled?): UntypedFormGroup {
    return this.formBuilder.group({
      name: [{ value: null, disabled: disabled }]
    });
  }

  addSize(disabled?) {
    this.sizeES = this.productESForm.get('size') as UntypedFormArray;
    this.sizeES.push(this.createSize(disabled));
    this.sizeEN = this.productENForm.get('size') as UntypedFormArray;
    this.sizeEN.push(this.createSize(disabled));
  }

  removeSize(index: number) {
    this.sizeES.removeAt(index);
    this.sizeEN.removeAt(index);
  }

  createCode(disabled?): UntypedFormGroup {
    return this.formBuilder.group({
      text: [{ value: null, disabled: disabled }, Validators.required],
      link: [{ value: null, disabled: disabled }]
    });
  }

  addCode(disabled?) {
    this.rewardStepperES = this.productESForm.get('rewardStepper') as UntypedFormArray;
    this.rewardStepperES.push(this.createCode(disabled));
    this.rewardStepperEN = this.productENForm.get('rewardStepper') as UntypedFormArray;
    this.rewardStepperEN.push(this.createCode(disabled));
  }

  removeCode(index: number) {
    this.rewardStepperES.removeAt(index);
    this.rewardStepperEN.removeAt(index);
  }

  changeLocalImage(event: any) {
    this.productForm.markAsDirty();

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
        switch (event.target.name) {
          case 'product-image':
            this.getBase64(
              event.target.files[event.target.files.length - 1]
            ).then((image: string) => {
              this.isProductLocalImageChanged = true;
              this.productLocalImage = image;
            });
            break;

          case 'description-image':
            this.getBase64(
              event.target.files[event.target.files.length - 1]
            ).then((image: string) => {
              this.areDescriptionLocalImagesChanged = true;
              this.descriptionLocalImages.push(image);
            });
            break;
        }
      } else {
        if (event.target.name === 'product-image') {
          this.imageProductUploader.clearQueue();
        } else {
          // tslint:disable-next-line: max-line-length
          this.imageDescriptionUploader.removeFromQueue(
            this.imageDescriptionUploader.queue[
            this.imageDescriptionUploader.queue.length - 1
            ]
          );
        }
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  changeCodeFile(event: any) {
    this.productForm.markAsDirty();
    this.productESForm.markAsDirty();
    this.productENForm.markAsDirty();

    if (event.target.files.length > 0) {
      const fileName = event.target.files[event.target.files.length - 1].name;

      if (
        fileName.substr(fileName.length - 3) === 'csv' ||
        fileName.substr(fileName.length - 3) === 'CSV'
      ) {
      } else {
        this.codeUploaderInput.nativeElement.value = '';
        this.codeUploader.clearQueue();
        this.toastr.error('El formato del archivo no es compatible', 'Error');
      }
    }
  }

  productUploadImages(productId) {
    let productImageFile = null;
    let descriptionImageFiles = [];
    let codeFile = null;

    if (this.codeUploader.queue.length > 0) {
      codeFile = this.codeUploader.queue[this.codeUploader.queue.length - 1]
        .file.rawFile;
      codeFile = codeFile.slice(0, codeFile.size, 'text/csv');
    }

    if (this.imageProductUploader.queue.length > 0) {
      productImageFile = this.imageProductUploader.queue[0].file.rawFile;
    }

    if (this.imageDescriptionUploader.queue.length > 0) {
      this.imageDescriptionUploader.queue.forEach((fileItem: FileItem) => {
        descriptionImageFiles = [
          ...descriptionImageFiles,
          fileItem.file.rawFile
        ];
      });
    }

    const imagesFormData = new FormData();
    const codeFormData = new FormData();

    if (codeFile !== null) {
      codeFormData.append('rewardCodes', codeFile);
      this.productService
        .uploadRewardCodes(codeFormData, productId)
        .subscribe();
    }

    if (productImageFile !== null) {
      const fileExtension = '.' + productImageFile.name.split('.').pop();
      const fileName = 'producto_' + new Date().getTime() + fileExtension;

      imagesFormData.append('image', productImageFile, fileName);
    }

    descriptionImageFiles.forEach(f => {
      const fileExtension = '.' + f.name.split('.').pop();
      const fileName = 'descripcion_' + new Date().getTime() + fileExtension;

      imagesFormData.append('description', f, fileName);
    });

    if (this.imagesToDelete.length > 0) {
      this.imagesToDelete.forEach(image => {
        this.deleteImages(image.image, image.key);
      });
    }

    if (productImageFile !== null || descriptionImageFiles.length > 0) {
      this.productService
        .uploadProductImages(imagesFormData, productId)
        .subscribe(
          response => {
            this.ngxLoader.stop();
            if (this.action === 'edit') {
              this.toastr.success('Producto editado con éxito', 'Listo');
            } else {
              this.toastr.success('Producto creado con éxito', 'Listo');
            }
            this.router.navigate([this.routerDefinitions.products + '/list']);
          },
          error => {
            this.toastr.error('Ha ocurrido un error', 'Error');
          }
        );
    } else {
      if (this.action === 'edit') {
        this.toastr.success('Producto editado con éxito', 'Listo');
      } else {
        this.toastr.success('Producto creado con éxito', 'Listo');
      }
      this.router.navigate([this.routerDefinitions.products + '/list']);
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

  showDialogDeleteImage(uploader?, index?, image?) {
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
        this.productForm.markAsDirty();

        if (uploader === 'description') {
          this.imagesToDelete.push({
            key: 'descriptionImageId',
            image: this.descriptionLocalImages[index]._id
          });
          if (!image._id) {
            this.imageDescriptionUploader.removeFromQueue(
              this.imageDescriptionUploader.queue[index]
            );
          }
          this.descriptionLocalImages.splice(index, 1);
        } else {
          if (this.productImageId) {
            this.imagesToDelete.push({
              key: 'imageId',
              image: this.productImageId
            });
            this.productImageId = null;
          }

          this.isProductImageDeleted = true;
          this.isProductLocalImageChanged = true;
          this.productLocalImage = '';

          if (this.imageProductUploaderInput) {
            this.imageProductUploaderInput.nativeElement.value = '';
          }

          this.imageProductUploader.clearQueue();
        }
      }
    });
  }

  showCodes() {
    const dialogRef = this.dialog.open(DialogRewardCodesComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        product: this.product,
        action: this.action
      }
    });

    dialogRef.componentInstance.codeChanges.subscribe(() => {
      const sizesArrayES = [];
      const sizesArrayEN = [];

      const rewardStepperES = [];
      const rewardStepperEN = [];

      const rewardStepper = [];

      const headers = {
        includes: 'imageId,descriptionImageId,typeId'
      };

      this.ngxLoader.start();

      this.productService
        .getById(this.productId, headers)
        .subscribe((product: any) => {
          this.ngxLoader.stop();

          for (let index = 0; index < product.size.es.length; index++) {
            sizesArrayES.push({ name: product.size.es[index] });
            sizesArrayEN.push({ name: product.size.en[index] });
            if (index !== product.size.es.length - 1) {
              if (this.action === 'view') {
                this.addSize(true);
              } else {
                this.addSize(false);
              }
            }
          }

          for (let index = 0; index < product.rewardStepper.length; index++) {

            rewardStepperES.push({
              text: product.rewardStepper[index].text.es,
              link: product.rewardStepper[index].link.es
            });

            rewardStepperEN.push({
              text: product.rewardStepper[index].text.en,
              link: product.rewardStepper[index].link.en
            });

            if (index !== product.rewardStepper.length - 1) {
              if (this.action === 'view') {
                this.addCode(true);
              } else {
                this.addCode(false);
              }
            }
          }

          const productES = {
            name: product.name.es,
            description: product.description.es,
            size: sizesArrayES,
            rewardStepper: rewardStepperES
          };

          const productEN = {
            name: product.name.en,
            description: product.description.en,
            size: sizesArrayEN,
            rewardStepper: rewardStepperEN
          };

          this.product = product;
          this.productImageId = product.imageId;
          this.productLocalImage = product.imageId;
          if (product.descriptionImageInfo) {
            this.descriptionLocalImages = product.descriptionImageInfo;
          }

          this.productStatus = product.status;

          dialogRef.componentInstance.data = {
            product: product,
            action: this.action
          };

          this.productForm.patchValue(product);
          this.productESForm.patchValue(productES);
          this.productENForm.patchValue(productEN);
        });
    });
  }

  getProductTypes() {
    this.productTypeService.getAll().subscribe(
      response => {
        this.productTypesOptions = response;
      },
      error => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  // getProductById() {
  //   const sizesArray = [];

  //   const headers = {
  //     includes: 'imageId,descriptionImageId,typeId'
  //   };

  //   this.ngxLoader.start();

  //   this.productService
  //     .getById(this.productId, headers)
  //     .subscribe((product: any) => {
  //       this.ngxLoader.stop();
  //       for (let index = 0; index < product.size.length; index++) {
  //         sizesArray.push({ name: product.size[index] });
  //         if (index !== product.size.length - 1) {
  //           if (this.action === 'view') {
  //             this.addSize(true);
  //           } else {
  //             this.addSize(false);
  //           }
  //         }
  //       }

  //       product.size = sizesArray;

  //       for (let index = 0; index < product.rewardStepper.length; index++) {
  //         if (index !== product.rewardStepper.length - 1) {
  //           if (this.action === 'view') {
  //             this.addCode(true);
  //           } else {
  //             this.addCode(false);
  //           }
  //         }
  //       }
  //       this.product = product;
  //       this.productImageId = product.imageId;
  //       this.productLocalImage = product.imageId;
  //       if (product.descriptionImageInfo) {
  //         this.descriptionLocalImages = product.descriptionImageInfo;
  //       }

  //       this.productStatus = product.status;
  //       this.productForm.patchValue(product);
  //     });
  // }

  getProductById() {

    const sizesArrayES = [];
    const sizesArrayEN = [];

    const rewardStepperES = [];
    const rewardStepperEN = [];

    const rewardStepper = [];

    const headers = {
      includes: 'imageId,descriptionImageId,typeId'
    };

    this.ngxLoader.start();

    this.productService
      .getById(this.productId, headers)
      .subscribe((product: any) => {
        this.ngxLoader.stop();

        for (let index = 0; index < product.size.es.length; index++) {
          sizesArrayES.push({ name: product.size.es[index] });
          sizesArrayEN.push({ name: product.size.en[index] });
          if (index !== product.size.es.length - 1) {
            if (this.action === 'view') {
              this.addSize(true);
            } else {
              this.addSize(false);
            }
          }
        }

        for (let index = 0; index < product.rewardStepper.length; index++) {

          rewardStepperES.push({
            text: product.rewardStepper[index].text.es,
            link: product.rewardStepper[index].link.es
          });

          rewardStepperEN.push({
            text: product.rewardStepper[index].text.en,
            link: product.rewardStepper[index].link.en
          });

          if (index !== product.rewardStepper.length - 1) {
            if (this.action === 'view') {
              this.addCode(true);
            } else {
              this.addCode(false);
            }
          }
        }

        const productES = {
          name: product.name.es,
          description: product.description.es,
          size: sizesArrayES,
          rewardStepper: rewardStepperES
        };

        const productEN = {
          name: product.name.en,
          description: product.description.en,
          size: sizesArrayEN,
          rewardStepper: rewardStepperEN
        };

        this.product = product;
        this.productImageId = product.imageId;
        this.productLocalImage = product.imageId;
        if (product.descriptionImageInfo) {
          this.descriptionLocalImages = product.descriptionImageInfo;
        }

        this.productStatus = product.status;

        this.corporateCodeSelected = this.product.corporateInfo.code

        this.productForm.patchValue(product);
        this.productESForm.patchValue(productES);
        this.productENForm.patchValue(productEN);
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

  deleteImages(image, fileKey) {
    this.productService
      .deleteProductImages(this.productId, fileKey, image)
      .subscribe(
        response => {
          this.ngxLoader.stop();
          this.toastr.success('Producto editado con éxito', 'Listo');
          this.router.navigate([this.routerDefinitions.products + '/list']);
        },
        error => {
          this.toastr.error('Ha ocurrido un error', 'Error');
        }
      );
  }

  saveForm(values, valuesES, valuesEN, valid, validES, validEN) {
    if (valid && validES && validEN) {
      this.isFormSaved = true;

      const sizesES = [];
      const sizesEN = [];

      valuesES.size.forEach(element => {
        sizesES.push(element.name);
      });

      valuesEN.size.forEach(element => {
        sizesEN.push(element.name);
      });

      const textsES = [];
      const linksES = [];

      const textsEN = [];
      const linksEN = [];

      valuesES.rewardStepper.forEach(element => {
        textsES.push(element.text);
        linksES.push(element.link);
      });

      valuesEN.rewardStepper.forEach(element => {
        textsEN.push(element.text);
        linksEN.push(element.link);
      });

      const rewardStepper = [];

      for (let index = 0; index < textsES.length; index++) {
        const textsObject = {
          es: textsES[index],
          en: textsEN[index]
        };

        const linksObject = {
          es: linksES[index],
          en: linksEN[index]
        };

        rewardStepper.push({
          text: textsObject,
          link: linksObject
        });
      }

      let newProduct = {
        name: {
          es: valuesES.name,
          en: valuesEN.name
        },
        description: {
          es: valuesES.description,
          en: valuesEN.description
        },
        typeId: values.typeId,
        price: values.price,
        discount: values.discount,
        size: {
          es: sizesES,
          en: sizesEN
        },
        rewardStepper: rewardStepper,
        status: "",
        corporateId: ""
      };

      if (this.role == "MANAGER") {
        newProduct.corporateId = this.corporateId
        newProduct.status = "INVISIBLE"
      } else {
        if (values.corporateInfo._id == null) {
          this.toastr.error(
            'Debes seleccionar una corporación',
            'Aviso'
          );
          return;
        }

        if (this.corporateCodeSelected == "CLOSCA" && (values.price == 0 || values.price == null)) {
          this.toastr.error(
            'Debes indicar un precio',
            'Aviso'
          );
          return;
        }

        newProduct.corporateId = values.corporateInfo._id
        newProduct.status = values.status
      }

      if (this.action === 'new') {
        this.createProduct(newProduct);
      } else {
        this.editProduct(newProduct);
      }
    }
  }

  corporateChange(event) {
    let corporateSelected = this.corporates.filter(corporate => corporate._id === event.value)[0]
    this.corporateCodeSelected = corporateSelected.code
    this.productForm.controls['corporateInfo'].get('code').setValue(corporateSelected.code);
  }

  checkForm(product, productES, productEN) {

    let result = false;

    if (product.invalid) {
      result = true;
    } else if (productES.invalid) {
      result = true;
    } else if (productEN.invalid) {
      result = true;
    } else if (!product.dirty) {
      result = true;
    } else if (!productES.dirty) {
      result = true;
    } else if (!productEN.dirty) {
      result = true;
    }

    return result;
  }
  createProduct(values) {
    this.ngxLoader.start();
    this.productService.create(values).subscribe(
      response => {
        this.productUploadImages(response._id);
      },
      error => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  editProduct(values) {
    this.ngxLoader.start();
    this.productService.editProduct(this.productId, values).subscribe(
      response => {
        this.productUploadImages(this.productId);
      },
      error => {
        this.toastr.error('Ha ocurrido un error', 'Error');
      }
    );
  }

  checkSpanish() {
    let rewardControls = [];
    let rewardText;

    // Get all rewardStepper controls
    rewardControls = this.getRewardESControls();

    // Get rewardStepper spanish text
    rewardText = rewardControls[0].controls.text.controls.es;

    // Check for any invalid spanish controls
    if (this.productForm.get('name').get('es').invalid) {
      return '*';
    } else if (this.productForm.get('description').get('es').invalid) {
      return '*';
    } else if (rewardText.invalid) {
      return '*';
    } else {
      return '';
    }
  }

  checkEnglish() {
    let rewardControls = [];
    let rewardText;

    // Get all rewardStepper controls
    rewardControls = this.getRewardENControls();

    // Get rewardStepper english text
    rewardText = rewardControls[0].controls.text.controls.en;

    // Check for any invalid english controls
    if (this.productForm.get('name').get('en').invalid) {
      return '*';
    } else if (this.productForm.get('description').get('en').invalid) {
      return '*';
    } else if (rewardText.invalid) {
      return '*';
    } else {
      return '';
    }
  }

  getSizeESControls() {
    return (this.productESForm.get('size') as UntypedFormArray).controls;
  }

  getSizeESControlsLength() {
    return (this.productESForm.get('size') as UntypedFormArray).length;
  }

  getRewardESControls() {
    return (this.productESForm.get('rewardStepper') as UntypedFormArray).controls;
  }

  getRewardESControlsLength() {
    return (this.productESForm.get('rewardStepper') as UntypedFormArray).length;
  }

  getSizeENControls() {
    return (this.productENForm.get('size') as UntypedFormArray).controls;
  }

  getSizeENControlsLength() {
    return (this.productENForm.get('size') as UntypedFormArray).length;
  }

  getRewardENControls() {
    return (this.productENForm.get('rewardStepper') as UntypedFormArray).controls;
  }

  getRewardENControlsLength() {
    return (this.productENForm.get('rewardStepper') as UntypedFormArray).length;
  }

  goToLink(url) {
    window.open(url, '_blank');
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }
}
