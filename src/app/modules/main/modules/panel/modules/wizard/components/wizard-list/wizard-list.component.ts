import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { CorporateService, OnboardingService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  selector: 'app-wizard-list',
  templateUrl: './wizard-list.component.html',
  styleUrls: ['./wizard-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WizardListComponent implements OnInit {
  items;
  corporates: Corporate[];

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

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // CONFIG TABLE
  tableConfig: TableConfig;
  // END CONFIG TABLE

  tableReady = false;

  filter;
  corporateId;
  role;

  constructor(
    private onboardingService: OnboardingService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.corporateId = this.loggedUserService.getCorporateId();
    this.role = this.loggedUserService.getRole();
    if (this.role == "MANAGER") {
      this.filter = `{"instance.status": "ACTIVE", "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"instance.status": "ACTIVE"}`;
    }

    this.sort = "instance.createAt"

    this.countOnboardings();
    this.getOnboardings();
    this.getCorporates();
  }

  ngOnInit() {
  }

  getOnboardings() {
    this.ngxLoader.start();

    const headers = convertToHttpHeaderMap({
      limit: this.paginator.limit,
      skip: this.paginator.skip,
      sort: this.sort,
      filter: this.filter
    });

    this.onboardingService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.items = response;
      });
  }

  countOnboardings() {
    const headers = convertToHttpHeaderMap({
      filter: this.filter
    });

    this.onboardingService
      .count(headers)
      .subscribe((response) => {
        this.paginator.length = response;
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

          let closcaCorporateIndex = this.corporates.findIndex(corporate => corporate.code === "CLOSCA")
          if (closcaCorporateIndex > -1) {
            this.corporates.splice(closcaCorporateIndex, 1);
          }

          this.setupTableConfig();
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
          this.setupTableConfig();
        });
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.resetPaginate();
    this.countOnboardings();
  }

  createFilter(filterValues) {
    let startFilter = `{"instance.status": "ACTIVE"`;

    const corporateFilter = ',"corporateId": "' + filterValues.corporateName + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat(finishFilter);

  }

  paginate(value) {
    this.getOnboardings();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getOnboardings();

  }

  deleteItem(item) {
    this.ngxLoader.start();
    this.onboardingService.delete(item._id).subscribe(
      response => {
        this.ngxLoader.stop();
        this.toastr.success(
          'La pantalla ha sido borrada correctamente',
          'Listo'
        );
        this.countOnboardings();
        this.getOnboardings();
      },
      error => {
        this.ngxLoader.stop();
        this.toastr.error(
          'Error al eliminar la pantalla',
          'Error'
        );
      }
    );
  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'icon',
          columnValue: 'iconInfo.fileRoute',
          headerLabel: 'Icono',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Icono',
            formControl: {
              name: 'icon'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'title',
          columnValue: 'title.es',
          columnType: 'STRING',
          headerLabel: 'Título',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Título',
            formControl: {
              name: 'title'
            },
            sortFilterExists: false
          }
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'icon',
          columnValue: 'iconInfo.fileRoute',
          headerLabel: 'Icono',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Icono',
            formControl: {
              name: 'icon'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'title',
          columnValue: 'title.es',
          columnType: 'STRING',
          headerLabel: 'Título',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Título',
            formControl: {
              name: 'title'
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
      ]
    }

    this.tableConfig = {
      filterColumnEnabled: false,
      paginatorExists: true,
      buttonsConfig: {
        viewButton: true,
        editButton: true,
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.wizard
      },
      columns: columns
    };

    this.tableReady = true;
  }
}
