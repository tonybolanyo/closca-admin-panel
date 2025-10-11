import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { ToastrService } from 'ngx-toastr';
import { PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES, FOUNTAIN_STATUSES, STATION_TYPES } from 'src/app/shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CorporateService, BrandService } from 'src/app/shared/custom-gnommo-base/services';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { Brand } from 'src/app/shared/custom-gnommo-base/models/brand.model';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [CommonModule],
  selector: 'app-fountains-impact-list',
  templateUrl: './fountains-impact-list.component.html',
  styleUrls: ['./fountains-impact-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FountainsImpactListComponent implements OnInit {
  items;
  corporates;
  brands;

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = true;
  // END FILTER

  // SORT
  sort;

  // DROPDOWNS
  fountainTypes = [...[{ name: 'Todos', value: '' }], ...PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES];

  stationTypes = [...[{ name: 'Todos', value: '' }], ...STATION_TYPES];

  fountainStatus = [...[{ name: 'Todos', value: '' }], ...FOUNTAIN_STATUSES];
  // END DROPDOWNS

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

  blockKeyboard = false;

  role;
  corporateId;

  constructor(
    private fountainService: FountainService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private corporateService: CorporateService,
    private brandService: BrandService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()


    if (this.role == "MANAGER") {
      this.filter = `{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{fountainStatus: { $ne: "DELETED"} }`;
    }

    this.sort = '-totalRefills';
    this.getCorporates();
    this.getFountains();
    this.countFountains();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countFountains();
  }

  createFilter(filterValues) {
    let startFilter
    if (this.role == "MANAGER") {
      startFilter = `{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = `{fountainStatus: { $ne: "DELETED"}`;
    }

    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const fountainTypeFilter = ',"fountainType": "' + filterValues.fountainType + '"';
    const stationTypeFilter = ',"stationType": "' + filterValues.stationType + '"';
    const addressFilter = ',"address.address": {$regex:".*' + filterValues.fountainAddress + '", $options: "i"}';
    const countryFilter = ',"address.country": {$regex:".*' + filterValues.fountainCountry + '", $options: "i"}';
    const fountainStatusFilter = ',"fountainStatus": "' + filterValues.status + '"';
    const corporateFilter = ',"corporateId": "' + filterValues.corporateName + '"';
    const brandFilter = ',"brandId": "' + filterValues.brandName + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.fountainAddress !== '' && filterValues.fountainAddress !== null) ? addressFilter : '')
      .concat((filterValues.fountainCountry !== '' && filterValues.fountainCountry !== null) ? countryFilter : '')
      .concat((filterValues.fountainType !== '' && filterValues.fountainType !== null
        && filterValues.fountainType.length !== 0) ? fountainTypeFilter : '')
      .concat((filterValues.stationType !== '' && filterValues.stationType !== null
        && filterValues.stationType.length !== 0) ? stationTypeFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat((filterValues.brandName !== '' && filterValues.brandName !== null && filterValues.brandName.length !== 0) ? brandFilter : '')
      .concat((filterValues.status !== '' && filterValues.status !== null && filterValues.status.length !== 0) ? fountainStatusFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  countFountains() {
    const headers = {
      filter: this.filter
    };
    this.fountainService
      .count(headers)
      .subscribe((response) => {
        if (response !== null) {
          this.paginator.length = 0;
          this.paginator.length = response.totalFountains;
        } else {
          this.paginator.length = 0;
        }
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (this.blockKeyboard) {
      event.returnValue = false;
      event.preventDefault();
    }
  }

  getFountains() {
    this.ngxLoader.start();
    this.blockKeyboard = true;

    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: this.sort,
      filter: this.filter
    };

    this.fountainService
      .getMetrics(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.blockKeyboard = false;

        this.items = [];

        if (response !== null) {

          response.map((fountain: any) => {
            fountain.status = this.changeFountainStatusName(fountain.fountainStatus);
            fountain.fountainTypeTranslate = this.changeFountainTypeName(fountain.fountainType);
            fountain.stationTypeTranslate = this.changeStationTypeName(fountain.stationType);

            if (!fountain.totalRefills) {
              fountain.totalRefills = 0;
            }

            if (!fountain.totalGrams) {
              fountain.totalGrams = 0;
            }

            if (!fountain.totalEuros) {
              fountain.totalEuros = 0;
            } else {
              fountain.totalEuros = Number((fountain.totalEuros).toFixed(2));
            }

            if (!fountain.totalCO2Grams) {
              fountain.totalCO2Grams = 0;
            } else {
              fountain.totalCO2Grams = Number((fountain.totalCO2Grams).toFixed(2));
            }

            if (!fountain.totalTurtle) {
              fountain.totalTurtle = 0;
            } else {
              fountain.totalTurtle = Number((fountain.totalTurtle).toFixed(2));
            }

            if (!fountain.totalWatts) {
              fountain.totalWatts = 0;
            }
          });

          this.items = response;

        }
      },
        error => {
          this.toastr.error('Ha ocurrido un error al cargar las fuentes, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        // this.ngxLoader.stop();
        if (response !== null) {
          this.corporates = response;
          this.corporates.unshift(new Corporate("", "Todas"));

          // this.setupTableConfig();
          this.getBrands()
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getBrands() {
    this.brandService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        if (response !== null) {
          this.brands = response;
          this.brands.unshift(new Brand("", "Todas"));

          this.setupTableConfig();
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las marcas, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'name',
          columnValue: 'name',
          columnLinkId: '_id',
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
          columnDef: 'fountainImage',
          columnValue: 'imageInfo.fileRoute',
          headerLabel: 'Imagen fuente',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen fuente',
            formControl: {
              name: 'fountainImage'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'fountainTypeTranslate',
          columnValue: 'fountainTypeTranslate',
          columnType: 'STRING',
          headerLabel: 'Tipo',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo',
            formControl: {
              name: 'fountainType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.fountainTypes,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'stationTypeTranslate',
          columnValue: 'stationTypeTranslate',
          columnType: 'STRING',
          headerLabel: 'Tipo de estación',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo de estación',
            formControl: {
              name: 'stationType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.stationTypes,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'status',
          headerLabel: 'Estado',
          columnValue: 'status',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'status'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.fountainStatus,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'fountainAddress',
          headerLabel: 'Dirección',
          columnValue: 'address.address',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Dirección',
            formControl: {
              name: 'fountainAddress'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'fountainCountry',
          headerLabel: 'País',
          columnValue: 'address.country',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'País',
            formControl: {
              name: 'fountainCountry'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'user',
          headerLabel: 'Creada por',
          columnValue: 'userInfo.userName',
          columnLinkId: 'userId',
          columnType: 'STRING',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Creada por',
            formControl: {
              name: 'userName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalRefills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
          headerLabel: 'Total refills',
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
          columnDef: 'name',
          columnValue: 'name',
          columnLinkId: '_id',
          columnBaseLink: this.routerDefinitions.publicOrPrivateFountains + '/edit',
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
          columnDef: 'fountainImage',
          columnValue: 'imageInfo.fileRoute',
          headerLabel: 'Imagen fuente',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen fuente',
            formControl: {
              name: 'fountainImage'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'fountainTypeTranslate',
          columnValue: 'fountainTypeTranslate',
          columnType: 'STRING',
          headerLabel: 'Tipo',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo',
            formControl: {
              name: 'fountainType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.fountainTypes,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'stationTypeTranslate',
          columnValue: 'stationTypeTranslate',
          columnType: 'STRING',
          headerLabel: 'Tipo de estación',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo de estación',
            formControl: {
              name: 'stationType'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.stationTypes,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'status',
          headerLabel: 'Estado',
          columnValue: 'status',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'status'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.fountainStatus,
              label: 'name',
              value: 'value'
            }
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
          columnDef: 'brandName',
          columnValue: 'brandInfo.name',
          columnType: 'STRING',
          headerLabel: 'Marca',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Marca',
            formControl: {
              name: 'brandName'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.brands,
              label: 'name',
              value: '_id'
            }
          },
        },
        {
          columnDef: 'fountainAddress',
          headerLabel: 'Dirección',
          columnValue: 'address.address',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Dirección',
            formControl: {
              name: 'fountainAddress'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'fountainCountry',
          headerLabel: 'País',
          columnValue: 'address.country',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'País',
            formControl: {
              name: 'fountainCountry'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'user',
          headerLabel: 'Creada por',
          columnValue: 'userInfo.userName',
          columnLinkId: 'userId',
          columnBaseLink: this.routerDefinitions.users + '/edit',
          columnType: 'LINK',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Creada por',
            formControl: {
              name: 'userName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalRefills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
          headerLabel: 'Total refills',
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
  }

  changeStationTypeName(stationType: any) {
    switch (stationType) {
      case 'WATER_FOUNTAIN':
        return 'Fuente de agua';
      case 'FILLING_STATION':
        return 'Estación de llenado';
    }
  }

  changeFountainTypeName(fountainType: any) {
    let result;
    switch (fountainType) {
      case 'PUBLIC':
        result = 'Publica';
        break;
      case 'RESTAURANT':
        result = 'Restaurante';
        break;
      case 'CAFE_BAR':
        result = 'Cafe bar';
        break;
      case 'HOTEL_HOSTEL':
        result = 'Hotel / Hostal';
        break;
      case 'SHOP':
        result = 'Tienda';
        break;
      case 'BANK':
        result = 'Banco';
        break;
      case 'OTHERS':
        result = 'Otro';
        break;
      case 'SPONSORED':
        result = 'Patrocinada';
        break;
      default:
        result = '';
        break;
    }
    return result;
  }

  changeFountainStatusName(fountainStatus: any) {
    let result;
    switch (fountainStatus) {
      case 'ACTIVE':
        result = 'Activa';
        break;
      case 'INACTIVE':
        result = 'Inactiva';
        break;
      case 'PENDING':
        result = 'Pendiente';
        break;
      case 'TEMP_CLOSED':
        result = 'Cerrada Temporalmente';
        break;
    }
    return result;
  }

  paginate(value) {
    this.getFountains();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getFountains();
  }

  downloadCSV() {
    const headers = {
      sort: this.sort,
      filter: this.filter
    };

    this.ngxLoader.start();

    this.fountainService.getCSV(headers).subscribe((fountains: [any]) => {
      fountains.forEach(fountain => {
        fountain.addressDirection = fountain.address.address
        fountain.postalCode = fountain.address.postalCode
        fountain.town = fountain.address.town
        fountain.province = fountain.address.province
        fountain.country = fountain.address.country

        fountain.createdAt = fountain.instance.createdAt
      });

      let fountainsStringify = JSON.stringify(
        fountains,
        [
          "_id",
          "name",
          "fountainType",
          "fountainStatus",
          "createdAt",
          "addressDirection",
          "postalCode",
          "town",
          "province",
          "country",
          "totalRefills",
          "totalGrams",
          "totalEuros",
          "totalCO2Grams",
          "totalTurtle",
          "totalWatts"
        ],
        4
      )

      let fountainsJSONtoCSV = JSON.parse(
        fountainsStringify
      );

      this.exportCSVFile(
        [
          "ID",
          "Nombre",
          "Tipo",
          "Estado",
          "Fecha creación (Timestamp)",
          "Dirección",
          "Código Postal",
          "Ciudad",
          "Provincia",
          "País",
          "Total refills",
          "Plástico ahorrado (gr)",
          "EUR ahorrados",
          "Emisiones de CO2 (gr)",
          "Tortugas salvadas",
          "Watts ahorrados"
        ],
        fountainsJSONtoCSV,
        "Impacto_fuentes"
      );

      this.ngxLoader.stop();
    },
      (error: Error) => {
        this.toastr.error('Ha ocurrido un error al cargar las fuentes, vuelve a intentarlo', 'Error');
        this.ngxLoader.stop();
      });
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
