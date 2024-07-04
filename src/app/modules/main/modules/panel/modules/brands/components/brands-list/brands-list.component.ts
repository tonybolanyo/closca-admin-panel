import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { BrandService } from 'src/app/shared/custom-gnommo-base/services/brands.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrandsListComponent implements OnInit {
  items;

  // FILTER
  filter = {};
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
      baseRouterLink: this.routerDefinitions.brands
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
          sortFilterExists: false,
        }
      },
      {
        columnDef: 'logo',
        columnValue: 'brandImageInfo.fileRoute',
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
        columnDef: 'totalFountains',
        columnValue: 'totalFountains',
        columnType: 'STRING',
        headerLabel: 'Fuentes asignadas',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Fuentes asignadas',
          formControl: {
            name: 'name'
          },
          sortFilterExists: true,
        },
      },
      {
        columnDef: 'totalRefills',
        columnValue: 'totalRefills',
        columnType: 'STRING',
        headerLabel: 'Refills totales',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Refills totales',
          formControl: {
            name: 'name'
          },
          sortFilterExists: true
        }
      }
    ]
  };
  // END CONFIG TABLE

  constructor(
    private brandService: BrandService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.filter = `{ "brandStatus": { $ne: "DELETED" } }`;
    this.sort = 'instance.createdAt';
    this.getBrands();
    this.countBrands();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countBrands();
  }

  createFilter(filterValues) {
    const startFilter = '{ "brandStatus": { $ne: "DELETED" }';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getBrands(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: this.paginator.limit,
      sort: this.sort,
      skip: this.paginator.skip,
      filter: this.filter
    };
    this.brandService
      .getAll(headers)
      .subscribe((brands) => {
        this.ngxLoader.stop();
        this.items = [];
        if (brands !== null) {

          // brands.map((brand: any) => {
          //   brand.totalFountains = 0;
          //   brand.fountains.forEach(fountain => {
          //     if (fountain.fountainStatus !== 'DELETED') {
          //       brand.totalFountains ++;
          //     }
          //   });

          // });

          brands.map((brand: any) => {
            if (brand.fountains) {
              brand.fountains.forEach(fountain => {
                if (!fountain.totalRefills) {
                  fountain.totalRefills = 0;
                }
              });
            }
          });

          this.items = brands;



          if (isDeletedItem && brands.length === 0) {
            this.resetPaginate();
          }
        } else {
          if (isDeletedItem) {
            this.resetPaginate();
          }
        }
      },
      (error) => {
        this.toastr.error('Ha ocurrido un error al cargar las marcas, vuelve a intentarlo', 'Error');
        this.ngxLoader.stop();
      });
  }

  countBrands() {
    const headers = {
      filter: this.filter
    };
    this.brandService
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
    this.brandService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.toastr.success('La marca ha sido borrada correctamente', 'Listo');
        this.countBrands();
        this.getBrands(true);
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al intentar borrar la marca', 'Error');
        });
  }

  paginate(value) {
    this.getBrands();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getBrands();
  }
}
