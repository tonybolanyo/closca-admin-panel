import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ToastrService } from 'ngx-toastr';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { Router } from '@angular/router';

@Component({
  standalone: true,
    imports: [RouterModule],
  selector: 'app-corporates-list',
  templateUrl: './corporates-list.component.html',
  styleUrls: ['./corporates-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorporatesListComponent implements OnInit {
  items;

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = true;
  // FILTER

  // SORT
  sort;

  // START PAGINATOR
  paginator = {
    length: 0,
    limit: 10,
    pageIndex: 0,
    skip: 0,
    pageSizeOptions: [2, 5, 10, 25, 100]
  };
  // END PAGINATOR

  routerDefinitions = ROUTER_DEFINITIONS;

  // START CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: true,
    paginatorExists: true,
    buttonsConfig: {
      viewButton: true,
      editButton: true,
      newButton: false,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.corporates
    },
    columns: [
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
          sortFilterExists: false
        }
      },
      {
        columnDef: 'logo',
        columnValue: 'logotypeInfo.fileRoute',
        columnType: 'IMG',
        headerLabel: 'Logo',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Imagen',
          formControl: {
            name: 'logo'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'code',
        columnValue: 'code',
        columnType: 'STRING',
        headerLabel: 'Código',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Código',
          formControl: {
            name: 'code'
          },
          sortFilterExists: false,
        },
      },
      {
        columnDef: 'domainWord',
        columnValue: 'domainWord',
        columnType: 'STRING',
        headerLabel: 'Palabra clave dominio',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Palabra clave dominio',
          formControl: {
            name: 'domainWord'
          },
          sortFilterExists: false,
        },
      },
      // {
      //   columnDef: 'beaconMajor',
      //   columnValue: 'beaconMajor',
      //   columnType: 'STRING',
      //   headerLabel: 'ID Beacons',
      //   filter: {
      //     exists: false,
      //     type: 'INPUT',
      //     placeholder: 'ID Beacons',
      //     formControl: {
      //       name: 'beaconMajor'
      //     },
      //     sortFilterExists: false,
      //   },
      // },
    ]
  };
  // END CONFIG TABLE

  constructor(
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private corporateService: CorporateService,
    private router: Router
  ) {
    this.filter = `{$and: [{"instance.status": {$ne: "INACTIVE"}}, {"instance.status": {$ne: "DELETED"}}]}`;
    this.sort = 'instance.createdAt';
    this.countCorporates();
    this.getCorporates();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.countCorporates();
    this.resetPaginate();
  }

  createFilter(filterValues) {
    const startFilter = '{$and: [{"instance.status": {$ne: "INACTIVE"}}, {"instance.status": {$ne: "DELETED"}}]}';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const codeFilter = ',"code": { $regex:".*' + filterValues.code + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.code !== '' && filterValues.code !== null) ? codeFilter : '')
      .concat(finishFilter);

  }

  countCorporates() {
    const headers = {
      filter: this.filter
    };
    this.corporateService
      .count(headers)
      .subscribe((response) => {
        this.paginator.length = response;

      });
  }

  getCorporates(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: this.sort,
      filter: this.filter
    };
    this.corporateService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.items = [];
        if (response !== null) {
          this.items = response;
          if (isDeletedItem && response.length === 0) {
            this.resetPaginate();
          }
        } else {
          if (isDeletedItem) {
            this.resetPaginate();
          }
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  deleteItem(item) {
    if (item.code == "CLOSCA") {
      this.toastr.error('No se puede eliminar la corporación de Closca', 'Error');
    } else {
      this.corporateService
        .delete(item._id, { 'Accept-language': 'es' })
        .subscribe(
          (response) => {
            this.toastr.success('La corporación ha sido borrado correctamente', 'Listo');
            this.countCorporates();
            this.getCorporates(true);
          },
          (error) => {
            this.toastr.error('Ha ocurrido un problema al intentar borrar la corporación', 'Error');
          }
        );
    }
  }

  paginate(value) {
    this.getCorporates();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getCorporates();

  }

  customEditNavigate(element) {
    if (element.code == "CLOSCA") {
      this.toastr.error('No se puede editar la corporación de Closca', 'Error');
    } else {
      this.router.navigate([this.routerDefinitions.corporates, 'edit', element._id]);
    }
    
  }

}
