import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { UserRatingsService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';

@Component({
  selector: 'app-user-rate-list',
  templateUrl: './user-rate-list.component.html',
  styleUrls: ['./user-rate-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserRateListComponent implements OnInit {
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
      deleteButton: false,
      baseRouterLink: this.routerDefinitions.userRate
    },
    columns: [
      {
        columnDef: 'userName',
        columnValue: 'userInfo.userName',
        columnType: 'STRING',
        headerLabel: 'Nombre de usuario',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Nombre de usuario',
          formControl: {
            name: 'userName'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'userEmail',
        columnValue: 'userInfo.email',
        columnType: 'STRING',
        headerLabel: 'Email del usuario',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Email del usuario',
          formControl: {
            name: 'userEmail'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'rate',
        columnValue: 'rate',
        columnType: 'RATING',
        headerLabel: 'Valoración',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: '',
          formControl: {
            name: 'rate'
          },
          sortFilterExists: true
        }
      },
      {
        columnDef: 'fountainName',
        columnValue: 'fountainInfo.name',
        columnType: 'STRING',
        headerLabel: 'Nombre de la fuente',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Nombre de la fuente',
          formControl: {
            name: 'fountainName'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'fountainAddress',
        columnValue: 'fountainInfo.address.address',
        columnType: 'STRING',
        headerLabel: 'Dirección de la fuente',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: '',
          formControl: {
            name: 'fountainAddress'
          },
          sortFilterExists: false
        }
      }
    ]
  };

  constructor(
    private userRatingService: UserRatingsService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.filter = '{"instance.status": "ACTIVE"}';
    this.sort = '-instance.createdAt';
    this.getUserRatings();
    this.countUserRatings();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countUserRatings();
  }

  createFilter(filterValues) {

    const startFilter = '{"instance.status": "ACTIVE"';
    const userNameFilter = ',"userInfo.userName": {$regex:".*' + filterValues.values.userName + '", $options: "i"}';
    const userEmailFilter = ',"userInfo.email": {$regex:".*' + filterValues.values.userEmail + '", $options: "i"}';
    const fountainNameFilter = ',"fountainInfo.name": {$regex:".*' + filterValues.values.fountainName + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.values.userName !== '' && filterValues.values.userName !== null) ? userNameFilter : '')
      .concat((filterValues.values.userEmail !== '' && filterValues.values.userEmail !== null) ? userEmailFilter : '')
      .concat((filterValues.values.fountainName !== '' && filterValues.values.fountainName !== null) ? fountainNameFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getUserRatings() {
    this.ngxLoader.start();

    const headers = convertToHttpHeaderMap({
      limit: this.paginator.limit,
      skip: this.paginator.skip,
      sort: this.sort,
      filter: this.filter
    });

    this.userRatingService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.items = response;
      },
        error => {
          this.toastr.error('Ha ocurrido un error al cargar las valoraciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  countUserRatings() {
    const headers = convertToHttpHeaderMap({
      filter: this.filter
    });
    this.userRatingService
      .count(headers)
      .subscribe((response) => {
        if (response !== null) {
          this.paginator.length = response;
        } else {
          this.paginator.length = 0;
        }
      });
  }

  paginate(value) {
    this.getUserRatings();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getUserRatings();
  }

}
