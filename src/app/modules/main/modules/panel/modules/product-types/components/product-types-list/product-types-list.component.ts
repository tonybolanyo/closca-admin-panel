import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { ProductTypesService } from 'src/app/shared/custom-gnommo-base/services';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-product-types-list',
  templateUrl: './product-types-list.component.html',
  styleUrls: ['./product-types-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductTypesListComponent implements OnInit {
  items;

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: false,
    paginatorExists: false,
    buttonsConfig: {
      viewButton: true,
      editButton: true,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.productTypes
    },
    columns: [
      {
        columnDef: 'name',
        columnValue: 'name.es',
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
        columnDef: 'description',
        columnValue: 'description.es',
        columnType: 'STRING',
        headerLabel: 'Descripción',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Descripción',
          formControl: {
            name: 'description'
          },
          sortFilterExists: false
        }
      }
    ]
  };
  // END CONFIG TABLE

  constructor(
    private productTypesService: ProductTypesService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService
  ) {
    this.getProductTypes();
   }

  ngOnInit() {
  }

  getProductTypes() {
    this.ngxLoader.start();
    this.productTypesService
    .getAll()
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.items = response;
    });
  }

  deleteItem(item) {
    this.ngxLoader.start();
    this.productTypesService.delete(item._id).subscribe(
      response => {
        this.ngxLoader.stop();
        this.toastr.success(
          'El tipo de producto ha sido borrado correctamente',
          'Listo'
        );
        this.getProductTypes();
      },
      error => {
        this.ngxLoader.stop();
        if (error.status === 409) {
          this.toastr.error(
            'No puedes borrar este tipo, esta siendo utilizado',
            'Error'
          );
        } else {
          this.toastr.error(
            'No puedes borrar este tipo, esta siendo utilizado',
            'Error'
          );
        }
      }
    );
  }
}
