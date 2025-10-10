import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BottleTypesService } from 'src/app/shared/custom-gnommo-base/services/bottle-types.service';

@Component({
  standalone: false,
  selector: 'app-bottle-types-list',
  templateUrl: './bottle-types-list.component.html',
  styleUrls: ['./bottle-types-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BottleTypesListComponent implements OnInit {
  items;

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
  tableConfig: TableConfig = {
    filterColumnEnabled: true,
    paginatorExists: true,
    buttonsConfig: {
      viewButton: true,
      editButton: true,
      newButton: false,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.bottleTypes
    },
    columns: [
      {
        columnDef: 'image',
        columnValue: 'imageInfo.fileRoute',
        columnType: 'IMG',
        headerLabel: 'Imagen',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Imagen',
          formControl: {
            name: 'image'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'name',
        columnValue: 'name',
        columnType: 'STRING',
        headerLabel: 'Nombre',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Nombre',
          formControl: {
            name: 'name'
          },
          sortFilterExists: false,
        }
      },
      {
        columnDef: 'color',
        columnValue: 'color',
        columnType: 'STRING',
        headerLabel: 'Color',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Color',
          formControl: {
            name: 'color'
          },
          sortFilterExists: false,
        },
      }
    ]
  };
  // END CONFIG TABLE

  constructor(
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private bottleTypesService: BottleTypesService
  ) {
    this.filter = `{ "instance.status": { $ne: "DELETED" } }`;
    this.sort = 'instance.createdAt';
    this.getBottleTypes();
    this.countBottleTypes();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countBottleTypes();
  }

  createFilter(filterValues) {
    const startFilter = '{ "instance.status": { $ne: "DELETED" }';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const colorFilter = ',"color": {$regex:".*' + filterValues.color + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.color !== '' && filterValues.color !== null) ? colorFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getBottleTypes() {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      sort: this.sort,
      skip: String(this.paginator.skip),
      filter: this.filter,
      "Accept-language": "es"
    };
    this.bottleTypesService
      .getAll(headers)
      .subscribe((bottleTypes) => {
        this.ngxLoader.stop();

        this.items = bottleTypes;
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al cargar los tipos de botellas, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  countBottleTypes() {
    const headers = {
      filter: this.filter
    };
    this.bottleTypesService
      .count(headers)
      .subscribe((response) => {
        if (response !== null) {
          this.paginator.length = response;
        } else {
          this.paginator.length = 0;
        }
      });
  }

  deleteItem(item) {
    this.bottleTypesService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.toastr.success('El tipo de bottella ha sido borrado correctamente', 'Listo');
        this.countBottleTypes();
        this.getBottleTypes();
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al intentar borrar el tipo de botella', 'Error');
        });
  }

  paginate(value) {
    this.getBottleTypes();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getBottleTypes();
  }

}
