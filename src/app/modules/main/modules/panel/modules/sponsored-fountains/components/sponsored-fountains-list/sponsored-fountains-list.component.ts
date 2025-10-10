import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { FOUNTAIN_STATUSES } from 'src/app/shared/constants/constants';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChangeFountainStatusComponent } from 'src/app/shared/components/change-fountain-status/change-fountain-status.component';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  selector: 'app-sponsored-fountains-list',
  templateUrl: './sponsored-fountains-list.component.html',
  styleUrls: ['./sponsored-fountains-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SponsoredFountainsListComponent implements OnInit {
  items;
  corporates;

  //
  // Items selected and selectAllItems boolean;
  //
  itemsSelected = [];
  isSelectAllItems = false;

  featuresList;

  // FILTER
  filter: any = {};
  filterForm;
  filterMode = true;

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

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // DROPDOWN
  fountainStatus = [...[{ name: 'Todos', value: '' }], ...FOUNTAIN_STATUSES];

  // TABLE
  tableConfig: TableConfig;


  role;
  corporateId;
  constructor(
    private fountainService: FountainService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()

    if (this.role == "MANAGER") {
      this.filter = `{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"fountainType": "SPONSORED", fountainStatus: { $ne: "DELETED"} }`;
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

  createFilter(filterValues) {
    let startFilter;

    if (this.role == "MANAGER") {
      startFilter = '{fountainStatus: { $ne: "DELETED"}, "corporateId": ObjectId("' + this.corporateId + '")';
    } else {
      startFilter = '{"fountainType": "SPONSORED", fountainStatus: { $ne: "DELETED"}';
    }

    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const addressFilter = ',"address.address": {$regex:".*' + filterValues.fountainAddress + '", $options: "i"}';
    const countryFilter = ',"address.country": {$regex:".*' + filterValues.fountainCountry + '", $options: "i"}';
    const fountainStatusFilter = ',"fountainStatus": "' + filterValues.status + '"}';
    const corporateFilter = ',"corporateId": "' + filterValues.corporateName + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.fountainAddress !== '' && filterValues.fountainAddress !== null) ? addressFilter : '')
      .concat((filterValues.fountainCountry !== '' && filterValues.fountainCountry !== null) ? countryFilter : '')
      .concat((filterValues.status !== '' && filterValues.status !== null && filterValues.status.length !== 0) ? fountainStatusFilter : '')
      .concat((filterValues.corporateName !== '' && filterValues.corporateName !== null && filterValues.corporateName !== undefined && filterValues.corporateName.length !== 0) ? corporateFilter : '')
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

  getFountains(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      sort: this.sort,
      filter: this.filter
    };

    this.fountainService
      .getAll(headers)
      .subscribe((response) => {
        this.ngxLoader.stop();

        this.items = [];
        this.isSelectAllItems = false;

        //
        // Used to count items selected at page;
        //
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

            if (fountain.features) {
              fountain.features = this.changeFountainFeaturesName(fountain.features);
            }
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

    let newStatus;
    const dialogRef = this.dialog.open(ChangeFountainStatusComponent, {
      width: '500px',
      height: '240px',
      disableClose: true,
      autoFocus: false,
      data: {
        // tslint:disable-next-line: max-line-length
        message: 'Seleccione el nuevo estado para las fuentes'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        newStatus = {
          fountainStatus: result
        };

        this.itemsSelected.forEach((item, index) => {

          this.fountainService
            .update(item._id, newStatus, { 'Accept-language': 'es' })
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
    }
    return result;
  }

  changeFountainFeaturesName(fountainFeatures: any) {
    let result = '';
    let contador = fountainFeatures.length;
    fountainFeatures.forEach(element => {
      switch (element) {
        case 'CHARGING_STATION':
          result = result + 'Estacion de carga';
          break;
        case 'HEALTHY_FOOD':
          result = result + 'Comida saludable';
          break;
        case 'RECYCLING_CULTURE':
          result = result + 'Cultura de reciclaje';
          break;
        case 'COMFY_SEATING':
          result = result + 'Area para sentarse';
          break;
        case 'FREE_WIFI':
          result = result + 'WiFi gratuito';
          break;
        case 'GOOD_FOOD':
          result = result + 'Buena comida';
          break;
        case 'GOOD_MUSIC':
          result = result + 'Buena musica';
          break;
        case 'GOOD_VIBES':
          result = result + 'Buen ambiente';
          break;
        case 'PET_FRIENDLY':
          result = result + 'Mascotas permitidas';
          break;
        case 'RETAIL_SPACE':
          result = result + 'Espacio comercial';
          break;
        case 'READING_ZONE':
          result = result + 'Zona de lectura';
          break;
        case 'BOARD_GAMES':
          result = result + 'Juegos de mesa';
          break;
        case 'AIR_CONDITIONED':
          result = result + 'Aire acondicionado';
          break;
        case 'LIVE_MUSIC':
          result = result + 'Musica en directo';
          break;
        case 'FITNESS_SPACE':
          result = result + 'Zona gimnasio';
          break;
        case 'GREAT_PRICES':
          result = result + 'Buenos precios';
          break;
        case 'SUNNY_PATIO':
          result = result + 'Terraza soleada';
          break;
        case 'WORKSPACE':
          result = result + 'Espacio de trabajo';
          break;
      }
      contador = contador - 1;
      if (contador !== 0) {
        result = result + ', ';
      }
    });
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

  setupTableConfig() {
    let columns;
    let buttonsConfig;

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
          columnDef: 'status',
          columnValue: 'status',
          columnType: 'STRING',
          headerLabel: 'Estado',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'status'
            },
            dropdownConfig: {
              items: this.fountainStatus,
              label: 'name',
              value: 'value'
            },
            sortFilterExists: false,
          },
        },
        {
          columnDef: 'brandName',
          columnValue: 'brandInfo.name',
          headerLabel: 'Nombre marca',
          columnType: 'STRING',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Nombre marca',
            formControl: {
              name: 'brandName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'brandImage',
          columnValue: 'brandInfo.brandImageInfo.fileRoute',
          headerLabel: 'Imagen marca',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen marca',
            formControl: {
              name: 'brandImage'
            },
            sortFilterExists: false
          }
        },
  
        {
          columnDef: 'fountainAddress',
          columnValue: 'address.address',
          columnType: 'STRING',
          headerLabel: 'Dirección',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Dirección',
            formControl: {
              name: 'fountainAddress'
            },
            sortFilterExists: false
          },
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
          columnDef: 'features',
          columnValue: 'features',
          columnType: 'STRING',
          headerLabel: 'Caracteristicas',
          filter: {
            exists: false,
            type: 'DROPDOWN',
            placeholder: 'Caracteristicas',
            formControl: {
              name: 'features'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalRefills',
          headerLabel: 'Total refills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
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

      buttonsConfig = null;
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
          columnDef: 'status',
          columnValue: 'status',
          columnType: 'STRING',
          headerLabel: 'Estado',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Estado',
            formControl: {
              name: 'status'
            },
            dropdownConfig: {
              items: this.fountainStatus,
              label: 'name',
              value: 'value'
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
          columnDef: 'brandName',
          columnValue: 'brandInfo.name',
          headerLabel: 'Nombre marca',
          columnType: 'STRING',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Nombre marca',
            formControl: {
              name: 'brandName'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'brandImage',
          columnValue: 'brandInfo.brandImageInfo.fileRoute',
          headerLabel: 'Imagen marca',
          columnType: 'IMG',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Imagen marca',
            formControl: {
              name: 'brandImage'
            },
            sortFilterExists: false
          }
        },
  
        {
          columnDef: 'fountainAddress',
          columnValue: 'address.address',
          columnType: 'STRING',
          headerLabel: 'Dirección',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Dirección',
            formControl: {
              name: 'fountainAddress'
            },
            sortFilterExists: false
          },
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
          columnDef: 'features',
          columnValue: 'features',
          columnType: 'STRING',
          headerLabel: 'Caracteristicas',
          filter: {
            exists: false,
            type: 'DROPDOWN',
            placeholder: 'Caracteristicas',
            formControl: {
              name: 'features'
            },
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalRefills',
          headerLabel: 'Total refills',
          columnValue: 'totalRefills',
          columnType: 'STRING',
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

      buttonsConfig = {
        viewButton: true,
        editButton: true,
        newButton: false,
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.sponsoredFountains
      };
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: buttonsConfig,
      columns: columns
    };
  }

}
