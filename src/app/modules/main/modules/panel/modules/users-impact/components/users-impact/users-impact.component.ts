import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ToastrService } from 'ngx-toastr';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { UserService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { Level } from 'src/app/shared/custom-gnommo-base/models/level.model';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  standalone: false,
  selector: 'app-users-impact',
  templateUrl: './users-impact.component.html',
  styleUrls: ['./users-impact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersImpactComponent implements OnInit {
  items;
  corporates;

  metricsTotal;

  // FILTER
  filter = {};
  filterTotal = {};
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
  tableConfig: TableConfig
  // END CONFIG TABLE

  tableReady = false;

  role;
  corporateId;

  constructor(
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private userService: UserService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()

    this.sort = '-totalRefills';

    if (this.role == "MANAGER") {
      this.filter = `{"role": "USER", "instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
      this.filterTotal = `{"instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"role": "USER", "instance.status": {$ne: "DELETED"}}`;
      this.filterTotal = `{"instance.status": {$ne: "DELETED"}}`;

      this.getUsersMetrics();
    }
    this.getUsersMetricsTotal();
    this.getCorporates();
    this.countUsers();
  }

  ngOnInit() {

  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);

    this.getUsersMetricsTotal();

    this.resetPaginate();
    this.countUsers();
  }

  createFilter(filterValues) {
    let startFilter
    let metricsTotalStartFilter
    if (this.role == "MANAGER") {
      startFilter = `{"role": "USER", "instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
      metricsTotalStartFilter = `{"instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = '{"role": "USER", "instance.status": {$ne: "DELETED"}';
      metricsTotalStartFilter = '{"instance.status": {$ne: "DELETED"}';
    }
    const emailFilter = ',"email": {$regex:".*' + filterValues.email + '", $options: "i"}';
    const userNameFilter = ',"userName": { $regex:".*' + filterValues.userName + '", $options: "i"}';
    const corporateFilter = ',"corporateId": ObjectId("' + filterValues.corporateName + '")';
    const levelFilter = ',"levelId": "' + filterValues.level + '"';
    const finishFilter = '}';

    this.filterTotal = metricsTotalStartFilter
      .concat((filterValues.email !== '' && filterValues.email !== null) ? emailFilter : '')
      .concat((filterValues.userName !== '' && filterValues.userName !== null) ? userNameFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName !== undefined && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat(finishFilter);

    this.filter = startFilter
      .concat((filterValues.email !== '' && filterValues.email !== null) ? emailFilter : '')
      .concat((filterValues.userName !== '' && filterValues.userName !== null) ? userNameFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName !== undefined && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat((filterValues.level !== '' && filterValues.level !== null && filterValues.level !== undefined && filterValues.level.length !== 0) ? levelFilter : '')
      .concat(finishFilter);

  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getUsersMetrics(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: this.paginator.limit,
      skip: this.paginator.skip,
      sort: this.sort,
      filter: this.filter
    };
    this.userService
      .getMetrics(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.items = [];
        if (response !== null) {
          response.map((user: any) => {
            if (!user.totalFountains) {
              user.totalFountains = 0;
            }

            if (!user.totalRefills) {
              user.totalRefills = 0;
            }

            if (!user.referalFriends) {
              user.referalFriends = 0;
            }

            if (!user.totalGrams) {
              user.totalGrams = 0;
            }

            if (!user.totalEuros) {
              user.totalEuros = 0;
            } else {
              user.totalEuros = Number((user.totalEuros).toFixed(2));
            }

            if (!user.totalCO2Grams) {
              user.totalCO2Grams = 0;
            } else {
              user.totalCO2Grams = Number((user.totalCO2Grams).toFixed(2));
            }

            if (!user.totalTurtle) {
              user.totalTurtle = 0;
            } else {
              user.totalTurtle = Number((user.totalTurtle).toFixed(2));
            }

            if (!user.totalWatts) {
              user.totalWatts = 0;
            }

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
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar los usuarios, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getUsersMetricsTotal() {
    this.ngxLoader.start();
    const headers = {
      filter: this.filterTotal
    };
    this.userService
      .getMetricsTotal(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        if (response !== null) {
          this.metricsTotal = response;

          if (this.metricsTotal.totalTurtle) {
            this.metricsTotal.totalTurtle = Number((this.metricsTotal.totalTurtle).toFixed(2));
          } else {
            this.metricsTotal.totalTurtle = 0
          }

          if (this.metricsTotal.totalCO2Grams) {
            this.metricsTotal.totalCO2Grams = Number((this.metricsTotal.totalCO2Grams).toFixed(2));
          } else {
            this.metricsTotal.totalCO2Grams = 0
          }

          if (this.metricsTotal.totalEuros) {
            this.metricsTotal.totalEuros = Number((this.metricsTotal.totalEuros).toFixed(2));
          } else {
            this.metricsTotal.totalEuros = 0
          }

          if (!this.metricsTotal.totalFountains) {
            this.metricsTotal.totalFountains = 0
          }

          if (!this.metricsTotal.referalFriends) {
            this.metricsTotal.referalFriends = 0
          }

          if (!this.metricsTotal.totalGrams) {
            this.metricsTotal.totalGrams = 0
          }

          if (!this.metricsTotal.totalWatts) {
            this.metricsTotal.totalWatts = 0
          }

          if (!this.metricsTotal.totalRefills) {
            this.metricsTotal.totalRefills = 0
          }
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar el impacto total, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
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
        }

        this.setupTableConfig();
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
          this.setupTableConfig();
        });
  }

  countUsers() {
    const headers = {
      filter: this.filter
    };
    this.userService
      .count(headers)
      .subscribe((response) => {
        this.paginator.length = response;

      });
  }

  paginate(value) {
    this.getUsersMetrics();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getUsersMetrics();


  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'userName',
          columnValue: 'userName',
          columnType: 'STRING',
          headerLabel: 'Nombre de usuario',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Nombre de usuario',
            formControl: {
              name: 'userName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'email',
          columnValue: 'email',
          columnType: 'STRING',
          headerLabel: 'Email',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Email',
            formControl: {
              name: 'email'
            },
            sortFilterExists: false,
          },
        },
        {
          columnDef: 'totalRefills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
          headerLabel: 'Total Refills',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Total refills',
            formControl: {
              name: 'totalRefills'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'totalFountains',
          columnValue: 'totalFountains',
          columnType: 'STRING',
          headerLabel: 'Fuentes creadas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Fuentes creadas',
            formControl: {
              name: 'totalFountains'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'referalFriends',
          columnValue: 'referalFriends',
          columnType: 'STRING',
          headerLabel: 'Amigos referidos',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Amigos referidos',
            formControl: {
              name: 'referalFriends'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalTurtle',
          columnValue: 'totalTurtle',
          columnType: 'STRING',
          headerLabel: 'Tortugas salvadas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Tortugas salvadas',
            formControl: {
              name: 'totalTurtle'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalCO2Grams',
          columnValue: 'totalCO2Grams',
          columnType: 'STRING',
          headerLabel: 'Emisiones de CO2 (gr)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Emisiones de CO2 (gr)',
            formControl: {
              name: 'totalCO2Grams'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalGrams',
          columnValue: 'totalGrams',
          columnType: 'STRING',
          headerLabel: 'Plástico ahorrado (gr)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Plástico ahorrado (gr)',
            formControl: {
              name: 'totalGrams'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalWatts',
          columnValue: 'totalWatts',
          columnType: 'STRING',
          headerLabel: 'Watts ahorrados',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Watts ahorrados',
            formControl: {
              name: 'totalWatts'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalEuros',
          columnValue: 'totalEuros',
          columnType: 'STRING',
          headerLabel: 'EUR ahorrados',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'EUR ahorrados',
            formControl: {
              name: 'totalEuros'
            },
            sortFilterExists: false
          }
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'userName',
          columnValue: 'userName',
          columnType: 'STRING',
          headerLabel: 'Nombre de usuario',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Nombre de usuario',
            formControl: {
              name: 'userName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'email',
          columnValue: 'email',
          columnType: 'STRING',
          headerLabel: 'Email',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Email',
            formControl: {
              name: 'email'
            },
            sortFilterExists: false,
          },
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
          columnDef: 'totalRefills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
          headerLabel: 'Total Refills',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Total refills',
            formControl: {
              name: 'totalRefills'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'totalFountains',
          columnValue: 'totalFountains',
          columnType: 'STRING',
          headerLabel: 'Fuentes creadas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Fuentes creadas',
            formControl: {
              name: 'totalFountains'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'referalFriends',
          columnValue: 'referalFriends',
          columnType: 'STRING',
          headerLabel: 'Amigos referidos',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Amigos referidos',
            formControl: {
              name: 'referalFriends'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalTurtle',
          columnValue: 'totalTurtle',
          columnType: 'STRING',
          headerLabel: 'Tortugas salvadas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Tortugas salvadas',
            formControl: {
              name: 'totalTurtle'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalCO2Grams',
          columnValue: 'totalCO2Grams',
          columnType: 'STRING',
          headerLabel: 'Emisiones de CO2 (gr)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Emisiones de CO2 (gr)',
            formControl: {
              name: 'totalCO2Grams'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalGrams',
          columnValue: 'totalGrams',
          columnType: 'STRING',
          headerLabel: 'Plástico ahorrado (gr)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Plástico ahorrado (gr)',
            formControl: {
              name: 'totalGrams'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalWatts',
          columnValue: 'totalWatts',
          columnType: 'STRING',
          headerLabel: 'Watts ahorrados',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Watts ahorrados',
            formControl: {
              name: 'totalWatts'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalEuros',
          columnValue: 'totalEuros',
          columnType: 'STRING',
          headerLabel: 'EUR ahorrados',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'EUR ahorrados',
            formControl: {
              name: 'totalEuros'
            },
            sortFilterExists: false
          }
        }
      ]
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      columns: columns
    };

    this.tableReady = true;
  }

  downloadCSV() {
    const headers = {
      sort: this.sort,
      filter: this.filter
    };

    this.ngxLoader.start();

    let metricsJSONtoExport = JSON.parse(
      JSON.stringify(
        [this.metricsTotal],
        [
          "totalRefills",
          "totalFountains",
          "referalFriends",
          "totalTurtle",
          "totalCO2Grams",
          "totalGrams",
          "totalWatts",
          "totalEuros"
        ], 4
      )
    );

    this.exportCSVFile(
      [
        "Total refills",
        "Fuentes creadas",
        "Amigos referidos",
        "Tortugas salvadas",
        "CO2 ahorrados (gr)",
        "Plástico ahorrado (gr)",
        "Energía ahorrada",
        "Dinero ahorrado (€)"
      ],
      metricsJSONtoExport,
      "Impacto_usuarios_total"
    );

    if (this.role != "MANAGER") {
      this.userService.getCSV(headers).subscribe((users: [any]) => {
        users.forEach(user => {
          user.createdAt = user.instance.createdAt
        });

        let usersStringify = JSON.stringify(
          users,
          [
            "_id",
            "userName",
            "email",
            "createdAt",
            "totalRefills",
            "totalGrams",
            "totalEuros",
            "totalCO2Grams",
            "totalTurtle",
            "totalWatts"
          ],
          4
        )

        let usersJSONtoCSV = JSON.parse(usersStringify);

        this.exportCSVFile(
          [
            "ID",
            "Nombre",
            "Email",
            "Fecha creación (Timestamp)",
            "Total refills",
            "Plástico ahorrado (gr)",
            "EUR ahorrados",
            "Emisiones de CO2 (gr)",
            "Tortugas salvadas",
            "Watts ahorrados"
          ],
          usersJSONtoCSV,
          "Impacto_usuarios");

        this.ngxLoader.stop();
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar los usuarios, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
    } else {
      this.ngxLoader.stop();
    }

  }

  exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if ((navigator as any).msSaveBlob) { // IE 10+
      (navigator as any).msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ';'

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

}
