import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PRODUCT_STATUSES } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { MatDialog } from '@angular/material/dialog';
import { ChangeProductStatusComponent } from 'src/app/shared/components/change-product-status/change-product-status.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule],
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent implements OnInit {
  items;
  corporates;

  //
  // Items selected and selectAllItems boolean;
  //
  itemsSelected = [];
  isSelectAllItems = false;

  productStatus = [...[{ name: 'Todos', value: '' }], ...PRODUCT_STATUSES];

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = true;
  // END FILTER

  // SORT
  sort;

  // PAGINATOR
  paginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // CONFIG TABLE
  tableConfig: TableConfig

  role;
  corporateId;

  constructor(
    private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog,
    private productService: ProductService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()
    if (this.role == "MANAGER") {
      this.filter = `{"instance.status":"ACTIVE", "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = '{"instance.status":"ACTIVE"}';
    }
    
    this.sort = 'instance.createdAt';
    this.getProducts();
    this.getCorporates();
    this.countProducts();
  }

  ngOnInit() {}

  filterFormChanges(values) {
    this.createFilter(values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countProducts();
  }

  createFilter(filterValues) {
    let unixDate;
    if (filterValues.rawValues.date) {
      const date = filterValues.rawValues.date;
      unixDate = date.getTime();
    }

    let startFilter
    if (this.role == "MANAGER") {
      startFilter = `{"instance.status":"ACTIVE", "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = '{"instance.status":"ACTIVE"';
    }

    const corporateFilter = ',"corporateId": "' + filterValues.rawValues.corporateName + '"';
    const nameFilter =
      ',"name.es": {$regex:".*' + filterValues.values.name + '", $options: "i"}';
    const startDateFilter =
      ',"instance.createdAt": { $lt: ' + moment(unixDate).add(1, 'd');
    const endDateFilter = ',$gte: ' + unixDate + ' }';
    const productStatusFilter =
      ',"status": "' + filterValues.values.status + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat(
        filterValues.values.name !== '' && filterValues.values.name !== null
          ? nameFilter
          : ''
      )
      .concat(
        filterValues.rawValues.date !== '' &&
          filterValues.rawValues.date !== null
          ? startDateFilter
          : ''
      )
      .concat(
        filterValues.rawValues.date !== '' &&
          filterValues.rawValues.date !== null
          ? endDateFilter
          : ''
      )
      .concat(
        filterValues.values.status !== '' &&
          filterValues.values.status !== null &&
          filterValues.values.status !== undefined &&
          filterValues.values.status.length !== 0
          ? productStatusFilter
          : ''
      )
      .concat((filterValues.rawValues.corporateName !== '' && filterValues.rawValues.corporateName !== null && filterValues.rawValues.corporateName !== undefined && filterValues.rawValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getProducts(isDeletedItem: boolean = false) {
    this.ngxLoader.start();

    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: this.sort,
      filter: this.filter,
      includes: 'imageId,descriptionImageId,typeId'
    };

    this.productService.getAll(headers).subscribe(response => {
      this.ngxLoader.stop();

      this.items = [];
      this.isSelectAllItems = false;
      let countSelectedItemsPage = 0;

      if (response !== null) {
        response.map((product: any) => {
          if (this.itemsSelected.find(item => item._id === product._id)) {
            product.isSelected = true;
            countSelectedItemsPage++;
          }

          if (!product.stock) {
            product.stock = 0;
          }

          product.status = this.changeProductStatusName(product.status);
          if (product.rewardCodes) {
            product.redeemed = product.rewardCodes.length - product.stock;
          } else {
            product.redeemed = 0;
          }

        });

        this.items = response;

        //
        // Check if all items of page are selected
        //
        if (this.items.length === countSelectedItemsPage) {
          this.isSelectAllItems = true;
        } else {
          this.isSelectAllItems = false;
        }

        if (isDeletedItem && response.length === 0) {
          this.resetPaginate();
        }
      } else {
        if (isDeletedItem) {
          this.resetPaginate();
        }
      }
    },
    error => {
      this.ngxLoader.stop();
      this.toastrService.error(
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
        if (response !== null) {
          this.corporates = response;
          this.corporates.unshift(new Corporate("", "Todas"));

          this.setupTableConfig();
        }
      },
        (error: Error) => {
          this.toastrService.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'checked',
          columnValue: '',
          columnType: 'CHECKBOX',
          headerLabel: '',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: '',
            formControl: {
              name: ''
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'productImage',
          columnValue: 'imageInfo.fileRoute',
          headerLabel: 'Imagen producto',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen producto',
            formControl: {
              name: 'productImage'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'name',
          columnValue: 'name.es',
          columnLinkId: '_id',
          columnBaseLink: this.routerDefinitions.products + '/view',
          columnType: 'LINK',
          headerLabel: 'Nombre',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Nombre',
            formControl: {
              name: 'name'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'date',
          columnValue: 'instance.createdAt',
          columnType: 'DATE',
          headerLabel: 'Fecha de subida',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha de subida',
            formControl: {
              name: 'date'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'stock',
          columnValue: 'stock',
          columnType: 'STRING',
          headerLabel: 'Stock',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Stock',
            formControl: {
              name: 'stock'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'redeemed',
          columnValue: 'redeemed',
          columnType: 'STRING',
          headerLabel: 'Veces canjeado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Veces canjeado',
            formControl: {
              name: 'redeemed'
            },
            sortFilterExists: false
          }
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'checked',
          columnValue: '',
          columnType: 'CHECKBOX',
          headerLabel: '',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: '',
            formControl: {
              name: ''
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'productImage',
          columnValue: 'imageInfo.fileRoute',
          headerLabel: 'Imagen producto',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen producto',
            formControl: {
              name: 'productImage'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'name',
          columnValue: 'name.es',
          columnLinkId: '_id',
          columnBaseLink: this.routerDefinitions.products + '/view',
          columnType: 'LINK',
          headerLabel: 'Nombre',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Nombre',
            formControl: {
              name: 'name'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'corporateName',
          columnValue: 'corporateInfo.name',
          columnType: 'STRING',
          headerLabel: 'Corporación',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Corporación',
            formControl: {
              name: 'corporateName'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.corporates,
              label: 'name',
              value: '_id'
            }
          },
        },
        {
          columnDef: 'date',
          columnValue: 'instance.createdAt',
          columnType: 'DATE',
          headerLabel: 'Fecha de subida',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha de subida',
            formControl: {
              name: 'date'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'status',
          columnValue: 'status',
          columnType: 'STRING',
          headerLabel: 'Fecha de subida',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'status'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.productStatus,
              label: 'name',
              value: 'value'
            }
          }
        },
        {
          columnDef: 'stock',
          columnValue: 'stock',
          columnType: 'STRING',
          headerLabel: 'Stock',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Stock',
            formControl: {
              name: 'stock'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'redeemed',
          columnValue: 'redeemed',
          columnType: 'STRING',
          headerLabel: 'Veces canjeado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Veces canjeado',
            formControl: {
              name: 'redeemed'
            },
            sortFilterExists: false
          }
        }
      ]
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: {
        viewButton: true,
        editButton: true,
        newButton: false,
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.products
      },
      columns: columns
    };
  }

  deleteItem(item) {
    this.productService.deleteProducts([item._id]).subscribe(
      response => {
        this.toastrService.success(
          'El producto ha sido borrado correctamente',
          'Listo'
        );
        this.countProducts();
        this.getProducts(true);
        this.clearSelectedProducts();
      },
      error => {
        this.toastrService.error(
          'Ha ocurrido un error al intentar borrar el producto',
          'Error'
        );
      }
    );
  }

  showDialogEditStatus() {
    let productsEdited;
    const dialogRef = this.dialog.open(ChangeProductStatusComponent, {
      width: '500px',
      height: '240px',
      disableClose: true,
      autoFocus: false,
      data: {
        // tslint:disable-next-line: max-line-length
        message: 'Seleccione el nuevo estado para los productos'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const itemsToEdit = [];

        this.itemsSelected.forEach(item => {
          itemsToEdit.push(item._id);
        });

        productsEdited = {
          ids: itemsToEdit,
          status: result
        };

        this.productService
        .editProductsStatus(productsEdited, { 'Accept-language': 'es' })
        .subscribe(
          response => {
            this.toastrService.success(
              'Los productos han sido actualizados correctamente',
              'Listo'
            );
            this.countProducts();
            this.getProducts();
            this.resetPaginate();
            this.clearSelectedProducts();

          },
          error => {
            this.toastrService.error(
              'Ha ocurrido un error al intentar editar los productos',
              'Error'
            );
          }
        );


      }
    });
  }

  deleteSelectedItems() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '380px',
      height: '170px',
      disableClose: true,
      autoFocus: false,
      data: {
        message: '¿Esta seguro que quiere borrar los elementos seleccionados?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const itemsToDelete = [];

        this.itemsSelected.forEach(item => {
          itemsToDelete.push(item._id);
        });

        this.productService
          .deleteProducts(itemsToDelete)
          .subscribe(
            response => {
              this.toastrService.success(
                'Los productos han sido borrados correctamente',
                'Listo'
              );
              this.clearSelectedProducts();
              this.countProducts();
              this.getProducts(true);
            },

            error => {
              this.toastrService.error(
                'Ha ocurrido un error al intentar borrar los productos',
                'Error'
              );
            }
          );
      }
    });
  }

  clearSelectedProducts() {
    this.itemsSelected.forEach(itemSelected => {
      const itemFound = this.items.find(item => item._id === itemSelected._id);

      if (itemFound) {
        itemFound.isSelected = false;
      }
    });

    this.itemsSelected = [];
    this.isSelectAllItems = false;
  }

  toggleAllItems(event) {
    // Set checkbox value at variable isSelectAllItems
    this.isSelectAllItems = event;

    //
    // If isSelectAllItems = false --> change all items of page to isSelect = false
    // else isSelectAllItems = true --> change all items of page to isSelect = true
    //
    if (!this.isSelectAllItems) {
      this.items.forEach((element, index) => {
        element.isSelected = false;
      });
    } else {
      this.items.forEach(element => {
        element.isSelected = true;
      });
    }

    //
    // Get selected Fountains method to update collection itemsSelected;
    //
    this.getSelectedProducts();
  }

  getSelectedProducts() {
    //
    // Used to count items selected at page;
    //
    let countSelectedItemsPage = 0;

    this.items.forEach((element, index) => {
      if (element.isSelected && element.isSelected === true) {
        countSelectedItemsPage++;

        const itemFound = this.itemsSelected.find(
          item => item._id === element._id
        );

        if (!itemFound) {
          this.itemsSelected.push(element);
        }
      } else {
        const result = this.itemsSelected.filter(
          item => item._id !== element._id
        );
        this.itemsSelected = result;
      }
    });

    //
    // Check if all items of page are selected
    //
    if (this.items.length === countSelectedItemsPage) {
      this.isSelectAllItems = true;
    } else {
      this.isSelectAllItems = false;
    }
  }

  changeProductStatusName(productStatus: any) {
    let result;
    switch (productStatus) {
      case 'VISIBLE':
        result = 'Visible';
        break;
      case 'INVISIBLE':
        result = 'Invisible';
        break;
      case 'OUT_OF_STOCK':
        result = 'Sin stock';
        break;
    }
    return result;
  }

  countProducts() {
    const headers = {
      filter: this.filter
    };
    this.productService.count(headers).subscribe(response => {
      if (response !== null) {
        this.paginator.length = 0;
        this.paginator.length = response;
      } else {
        this.paginator.length = 0;
      }
    });
  }

  paginate(value) {
    this.getProducts();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getProducts();
  }
}
