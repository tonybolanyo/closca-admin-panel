import { Component, OnInit } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { REPORT_TYPES } from 'src/app/shared/constants/constants';
import { ReportService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  reportStatusArray = [
    { name: "Pendiente", value: "PENDING" },
    { name: "Aceptado", value: "ACCEPTED" },
    { name: "Rechazado", value: "REJECTED" }
  ];

  items;
  corporates;

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = true;
  // END FILTER

  // DROPDOWNS
  reportTypes = [...[{ name: 'Todos', value: '' }], ...REPORT_TYPES];
  // END DROPDOWNS

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
  // END CONFIG TABLE

  role;
  corporateId;

  constructor(
    private reportService: ReportService,
    private corporateService: CorporateService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()

    // if (this.role == "MANAGER") {
    // this.filter = '{"corporateId": ObjectId("' + this.corporateId + '")}';
    // } else {
    this.filter = '';
    // }

    this.getCorporates();
    this.getReports();
    this.countReports();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values);
    this.resetPaginate();
    this.countReports();
  }

  createFilter(filterValues) {
    let unixDate;
    if (filterValues.rawValues.date) {
      let date = filterValues.rawValues.date;
      unixDate = date.getTime();
      // unixDate = moment(unixDate).add(2, 'h');
    }

    const startFilter = '{'; //"corporateId": ObjectId("' + this.corporateId + '"),
    const startDateFilter = '"instance.createdAt": { $lt: ' + moment(unixDate).add(1, 'd') + ',';
    const endDateFilter = '$gte: ' + unixDate + ' },';
    const reportTypeFilter = '"reportType": "' + filterValues.values.reportType + '",';
    const reportStatusFilter = '"reportStatus": "' + filterValues.values.reportStatus + '",';
    const emailFilter = '"userInfo.email": {$regex:".*' + filterValues.values.email + '", $options: "i"';
    // tslint:disable-next-line: max-line-length
    const finishFilter = '}';

    this.filter = startFilter
      // tslint:disable-next-line: max-line-length
      .concat((filterValues.values.reportType !== '' && filterValues.values.reportType !== null && filterValues.values.reportType.length !== 0) ? reportTypeFilter : '')
      .concat((filterValues.values.reportStatus !== '' && filterValues.values.reportStatus !== null && filterValues.values.reportStatus.length !== 0) ? reportStatusFilter : '')
      .concat((filterValues.values.userEmail !== '' && filterValues.values.userEmail !== null) ? emailFilter : '')
      .concat((filterValues.rawValues.date !== '' && filterValues.rawValues.date !== null) ? startDateFilter : '')
      .concat((filterValues.rawValues.date !== '' && filterValues.rawValues.date !== null) ? endDateFilter : '')
      .concat(finishFilter);
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();

        if (response !== null) {
          this.corporates = response;
          this.corporates.unshift(new Corporate("", "Todas"));
        }

        this.setupTableConfig();
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();

          this.setupTableConfig();
        });
  }

  getReports(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: '-instance.createdAt',
      filter: this.filter
    };

    this.reportService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.items = [];
        if (response !== null) {
          response.map((report: any) => {
            report.reportType = this.changeReportTypeName(report.reportType);
            report.reportStatus = this.changeReportStatusName(report.reportStatus)
          });
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
        error => {
          this.toastr.error('Ha ocurrido un error al cargar los reportes, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  deleteItem(item) {
    this.reportService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.toastr.success('El reporte ha sido borrado correctamente', 'Listo');
          this.countReports();
          this.getReports(true);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un problema al intentar borrar el reporte', 'Error');
        }
      );

  }

  countReports() {
    const headers = {
      filter: this.filter
    };
    this.reportService
      .count(headers)
      .subscribe((response) => {
        if (response !== null) {
          this.paginator.length = response;
        } else {
          this.paginator.length = 0;
        }
      });
  }

  changeReportTypeName(reportType: any) {
    let result;
    switch (reportType) {
      case 'FOUNTAIN_NOT_EXIST':
        result = 'La fuente no existe';
        break;
      case 'WATER_NOT_POTABLE':
        result = 'El agua no es potable';
        break;
      case 'INFORMATION_ERROR':
        result = 'Información erronea';
        break;
      case 'OTHERS':
        result = 'Otros';
        break;
    }
    return result;
  }

  paginate(value) {
    this.getReports();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getReports();
  }

  changeReportStatusName(reportStatus: any) {
    let result;
    switch (reportStatus) {
      case 'PENDING':
        result = 'Pendiente';
        break;
      case 'ACCEPTED':
        result = 'Aceptado';
        break;
      case 'REJECTED':
        result = 'Rechazado';
        break;
      default:
        result = '';
        break;
    }
    return result;
  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'reportType',
          columnValue: 'reportType',
          columnType: 'STRING',
          headerLabel: 'Tipo',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo',
            formControl: {
              name: 'reportType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.reportTypes,
              label: 'name',
              value: 'value'
            }
          },
        },

        {
          columnDef: 'reportStatus',
          columnValue: 'reportStatus',
          columnType: 'STRING',
          headerLabel: 'Estado',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'reportStatus'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.reportStatusArray,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'userEmail',
          columnValue: 'userInfo.email',
          columnType: 'STRING',
          headerLabel: 'Email usuario',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Email usuario',
            formControl: {
              name: 'userEmail'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'date',
          columnValue: 'instance.createdAt',
          columnType: 'DATE',
          headerLabel: 'Fecha',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha',
            formControl: {
              name: 'date'
            },
            sortFilterExists: false
          }
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'reportType',
          columnValue: 'reportType',
          columnType: 'STRING',
          headerLabel: 'Tipo',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo',
            formControl: {
              name: 'reportType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.reportTypes,
              label: 'name',
              value: 'value'
            }
          },
        },

        {
          columnDef: 'reportStatus',
          columnValue: 'reportStatus',
          columnType: 'STRING',
          headerLabel: 'Estado',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'reportStatus'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.reportStatusArray,
              label: 'name',
              value: 'value'
            }
          },
        },
        // {
        //   columnDef: 'corporateName',
        //   columnValue: 'corporateInfo.name',
        //   columnType: 'STRING',
        //   headerLabel: 'Corporación',
        //   filter: {
        //     exists: true,
        //     type: 'DROPDOWN',
        //     placeholder: 'Corporación',
        //     formControl: {
        //       name: 'corporateName'
        //     },
        //     sortFilterExists: false,
        //     dropdownConfig: {
        //       items: this.corporates,
        //       label: 'name',
        //       value: '_id'
        //     }
        //   },
        // },
        {
          columnDef: 'userEmail',
          columnValue: 'userInfo.email',
          columnType: 'STRING',
          headerLabel: 'Email usuario',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Email usuario',
            formControl: {
              name: 'userEmail'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'date',
          columnValue: 'instance.createdAt',
          columnType: 'DATE',
          headerLabel: 'Fecha',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha',
            formControl: {
              name: 'date'
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
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.reports
      },
      columns: columns
    };
  }

}
