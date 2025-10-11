import { RouterModule } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BottleService } from 'src/app/shared/custom-gnommo-base/services';

@Component({
  standalone: true,
    imports: [RouterModule],
  selector: 'app-bottles-list',
  templateUrl: './bottles-list.component.html',
  styleUrls: ['./bottles-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BottlesListComponent implements OnInit {
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
      editButton: false,
      newButton: false,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.bottles
    },
    columns: [
      {
        columnDef: 'image',
        columnValue: 'bottleTypeInfo.imageInfo.fileRoute',
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
        columnDef: 'userEmail',
        columnValue: 'userInfo.email',
        columnType: 'STRING',
        headerLabel: 'Usuario',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Usuario',
          formControl: {
            name: 'userEmail'
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
    private bottleService: BottleService
  ) {
    this.filter = `{ "instance.status": { $ne: "DELETED" } }`;
    this.sort = 'instance.createdAt';
    this.getBottles();
    this.countBottles();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countBottles();
  }

  createFilter(filterValues) {
    const startFilter = '{ "instance.status": { $ne: "DELETED" }';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const emailFilter = ',"userInfo.email": {$regex:".*' + filterValues.userEmail + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.userEmail !== '' && filterValues.userEmail !== null) ? emailFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getBottles() {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      sort: this.sort,
      skip: String(this.paginator.skip),
      filter: this.filter
    };
    this.bottleService
      .getAll(headers)
      .subscribe((bottles) => {
        this.ngxLoader.stop();

        this.items = bottles;
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al cargar las botellas, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  countBottles() {
    const headers = {
      filter: this.filter
    };
    this.bottleService
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
    this.bottleService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.toastr.success('La botella ha sido borrado correctamente', 'Listo');
        this.countBottles();
        this.getBottles();
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al intentar borrar la botella', 'Error');
        });
  }

  paginate(value) {
    this.getBottles();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getBottles();
  }

}
