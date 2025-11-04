import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { ToastrService } from 'ngx-toastr';
import { PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES, FOUNTAIN_STATUSES, STATION_TYPES } from 'src/app/shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ChangeFountainStatusComponent } from 'src/app/shared/components/change-fountain-status/change-fountain-status.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';

@Component({
  selector: 'app-public-or-private-fountains-list',
  templateUrl: './public-or-private-fountains-list.component.html',
  styleUrls: ['./public-or-private-fountains-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublicOrPrivateFountainsListComponent implements OnInit {
  items;
  corporates;
  //
  // Items selected and selectAllItems boolean;
  //
  itemsSelected = [];
  isSelectAllItems = false;

  exportButtonDisabled = true

  // FILTER
  filter = {};
  filterExport = {};
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
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()


    if (this.role == "MANAGER") {
      this.filter = `{"fountainType": { $ne: "SPONSORED" }, fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
      this.filterExport = `{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"fountainType": { $ne: "SPONSORED" }, fountainStatus: { $ne: "DELETED"} }`;
      this.filterExport = `{fountainStatus: { $ne: "DELETED"} }`;
    }

    this.sort = 'instance.createdAt';
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
    let startFilterExport
    if (this.role == "MANAGER") {
      startFilter = `{"fountainType": { $ne: "SPONSORED" }, fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
      startFilterExport = `{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = `{"fountainType": { $ne: "SPONSORED" }, fountainStatus: { $ne: "DELETED"}`;
      startFilterExport = `{fountainStatus: { $ne: "DELETED"}`;
    }

    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const fountainTypeFilter = ',"fountainType": "' + filterValues.fountainType + '"';
    const stationTypeFilter = ',"stationType": "' + filterValues.stationType + '"';
    const addressFilter = ',"address.address": {$regex:".*' + filterValues.fountainAddress + '", $options: "i"}';
    const countryFilter = ',"address.country": {$regex:".*' + filterValues.fountainCountry + '", $options: "i"}';
    const fountainStatusFilter = ',"fountainStatus": "' + filterValues.status + '"';
    const corporateFilter = ',"corporateId": "' + filterValues.corporateName + '"';
    // const userNameFilter = ',"userInfo.userName": {$regex:".*' + filterValues.userName + '", $options: "i"}';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.fountainAddress !== '' && filterValues.fountainAddress !== null) ? addressFilter : '')
      .concat((filterValues.fountainCountry !== '' && filterValues.fountainCountry !== null) ? countryFilter : '')
      // .concat((filterValues.userName !== '' && filterValues.userName !== null) ? userNameFilter : '')
      .concat((filterValues.fountainType !== '' && filterValues.fountainType !== null
        && filterValues.fountainType.length !== 0) ? fountainTypeFilter : '')
      .concat((filterValues.stationType !== '' && filterValues.stationType !== null
        && filterValues.stationType.length !== 0) ? stationTypeFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat((filterValues.status !== '' && filterValues.status !== null && filterValues.status.length !== 0) ? fountainStatusFilter : '')
      .concat(finishFilter);

    this.filterExport = startFilterExport
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.fountainAddress !== '' && filterValues.fountainAddress !== null) ? addressFilter : '')
      .concat((filterValues.fountainCountry !== '' && filterValues.fountainCountry !== null) ? countryFilter : '')
      // .concat((filterValues.userName !== '' && filterValues.userName !== null) ? userNameFilter : '')
      .concat((filterValues.fountainType !== '' && filterValues.fountainType !== null
        && filterValues.fountainType.length !== 0) ? fountainTypeFilter : '')
      .concat((filterValues.stationType !== '' && filterValues.stationType !== null
        && filterValues.stationType.length !== 0) ? stationTypeFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat((filterValues.status !== '' && filterValues.status !== null && filterValues.status.length !== 0) ? fountainStatusFilter : '')
      .concat(finishFilter);

      if (this.filterExport == startFilterExport.concat(finishFilter)) {
        this.exportButtonDisabled = true
      } else {
        this.exportButtonDisabled = false
      }
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  countFountains() {
    const headers = convertToHttpHeaderMap({
      filter: this.filter
    });
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

  getFountains(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    this.blockKeyboard = true;

    const headers = convertToHttpHeaderMap({
      limit: this.paginator.limit,
      skip: this.paginator.skip,
      sort: this.sort,
      filter: this.filter
    });

    this.fountainService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.blockKeyboard = false;

        this.items = [];
        this.isSelectAllItems = false;
        let countSelectedItemsPage = 0;

        if (response !== null) {

          response.map((fountain: any) => {

            if (this.itemsSelected.find(item => item._id === fountain._id)) {
              fountain.isSelected = true;
              countSelectedItemsPage++;
            }

            if (!fountain.totalRefills) {
              fountain.totalRefills = 0;
            }

            fountain.status = this.changeFountainStatusName(fountain.fountainStatus);
            fountain.fountainTypeTranslate = this.changeFountainTypeName(fountain.fountainType);
            fountain.stationTypeTranslate = this.changeStationTypeName(fountain.stationType);
          });

          this.items = response;


          //
          // Check if all items of page are selected
          //
          if (this.items.length === countSelectedItemsPage) {
            this.isSelectAllItems = true;
          } else {
            this.isSelectAllItems = false;
          }

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
          this.toastr.error('Ha ocurrido un error al cargar las fuentes, vuelve a intentarlo', 'Error');
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

          this.setupTableConfig();
        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  setupTableConfig() {
    let columns

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'checked',
          columnValue: '',
          columnType: 'CHECKBOX',
          headerLabel: '',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: '',
            formControl: {
              name: ''
            },
            sortFilterExists: false
          }
        },
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
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'checked',
          columnValue: '',
          columnType: 'CHECKBOX',
          headerLabel: '',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: '',
            formControl: {
              name: ''
            },
            sortFilterExists: false
          }
        },
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
        }
      ]
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: {
        validateButton: true,
        viewButton: true,
        editButton: true,
        newButton: false,
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.publicOrPrivateFountains
      },
      columns: columns
    };
  }

  getSelectedFountains() {

    //
    // Used to count items selected at page;
    //
    let countSelectedItemsPage = 0;

    this.items.forEach((element, index) => {

      if (element.isSelected && element.isSelected === true) {
        countSelectedItemsPage++;

        const itemFound = this.itemsSelected.find(item => item._id === element._id);

        if (!itemFound) {

          this.itemsSelected.push(element);
        }

      } else {

        const result = this.itemsSelected.filter(item => item._id !== element._id);
        this.itemsSelected = result;
      }

    });

    //
    // Check if all items of page are selected
    //
    if (this.items.length === countSelectedItemsPage) {
      this.isSelectAllItems = true;
    } else {
      this.isSelectAllItems = false;
    }
  }

  toggleAllItems(event) {

    // Set checkbox value at variable isSelectAllItems
    this.isSelectAllItems = event;

    //
    // If isSelectAllItems = false --> change all items of page to isSelect = false
    // else isSelectAllItems = true --> change all items of page to isSelect = true
    //
    if (!this.isSelectAllItems) {

      this.items.forEach((element, index) => {
        element.isSelected = false;
      });

    } else {

      this.items.forEach((element) => {
        element.isSelected = true;
      });

    }

    //
    // Get selected Fountains method to update collection itemsSelected;
    //
    this.getSelectedFountains();

  }

  clearSelectedFountains() {

    this.itemsSelected.forEach((itemSelected) => {

      const itemFound = this.items.find(item => item._id === itemSelected._id);

      if (itemFound) {
        itemFound.isSelected = false;
      }
    });

    this.itemsSelected = [];
    this.isSelectAllItems = false;

  }

  showDialogEditStatus() {

    let newStatusAndInactiveReason;
    const dialogRef = this.dialog.open(ChangeFountainStatusComponent, {
      width: '500px',
      height: '300px',
      disableClose: true,
      autoFocus: false,
      data: {
        // tslint:disable-next-line: max-line-length
        message: 'Seleccione el nuevo estado para las fuentes'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        newStatusAndInactiveReason = {
          fountainStatus: result.newFountainStatus,
          inactiveReason: result.inactiveReason,
          reopenDate: result.reopenDate
        };

        this.itemsSelected.forEach((item, index) => {
          this.fountainService
            .update(item._id, newStatusAndInactiveReason, { 'Accept-language': 'es' })
            .subscribe(
              (response) => {

                if (index === this.itemsSelected.length - 1) {

                  this.toastr.success('Las fuentes han sido actualizadas correctamente', 'Listo');
                  this.countFountains();
                  this.getFountains();
                  this.resetPaginate();
                  this.clearSelectedFountains();

                }
              },
              (error) => {

                this.toastr.error('Ha ocurrido un error al intentar editar las fuentes', 'Error');
              });

        });

      }
    });

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

  deleteItem(item) {

    this.fountainService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {

          this.toastr.success('La fuente ha sido borrada correctamente', 'Listo');
          this.countFountains();
          this.getFountains(true);
          this.clearSelectedFountains();

        },
        (error) => {

          this.toastr.error('Ha ocurrido un error al intentar borrar la fuente', 'Error');
        }
      );
  }

  deleteSelectedItems() {

    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '380px',
      height: '170px',
      disableClose: true,
      autoFocus: false,
      data: {
        message: '¿Esta seguro que quiere borrar los elementos seleccionados?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.itemsSelected.forEach((element, index) => {
          this.fountainService
            .delete(element._id, { 'Accept-language': 'es' })
            .subscribe(
              (response) => {

                if (index === this.itemsSelected.length - 1) {

                  this.toastr.success('Las fuentes han sido borradas correctamente', 'Listo');
                  this.clearSelectedFountains();
                  this.countFountains();
                  this.getFountains(true);
                }
              },

              (error) => {
                this.toastr.error('Ha ocurrido un error al intentar borrar las fuentes', 'Error');
              }
            );
        });
      }
    });
  }

  validateFountain(item) {

    const fountainStatus: any = { fountainStatus: 'ACTIVE' };

    this.fountainService
      .update(item._id, fountainStatus, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {

          this.toastr.success('Fuente activada con exito', 'Listo');
          this.getFountains();

        },
        error => {
          this.toastr.error('Ha ocurrido un error al intentar activar la fuente', 'Error');
        });
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
    const headers = convertToHttpHeaderMap({
      // sort: this.sort,
      filter: this.filterExport
    });

    this.ngxLoader.start();

    this.fountainService.getSimpleCSV(headers).subscribe((fountains: [any]) => {
      fountains.forEach(fountain => {
        fountain.name = fountain.name || ""
        fountain.fountainType = fountain.fountainType || ""
        fountain.fountainStatus = fountain.fountainStatus || ""
        
        fountain.createdAt = fountain.instance.createdAt || ""

        fountain.addressDirection = fountain.address.address || ""
        fountain.postalCode = fountain.address.postalCode || ""
        fountain.town = fountain.address.town || ""
        fountain.province = fountain.address.province || ""
        fountain.country = fountain.address.country || ""

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
        ],
        fountainsJSONtoCSV,
        "Fuentes"
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
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
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
