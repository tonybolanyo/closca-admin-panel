import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChallengeService, CorporateService } from 'src/app/shared/custom-gnommo-base/services';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';
import {
  CHALLENGE_STATUSES,
  CHALLENGE_TYPES,
  S3_URL
} from 'src/app/shared/constants/constants';
import moment from 'moment';
import clonedeep from 'lodash.clonedeep';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { DialogConfirmationComponent } from 'src/app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule],
  selector: 'app-challenges-list',
  templateUrl: './challenges-list.component.html',
  styleUrls: ['./challenges-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChallengesListComponent implements OnInit {
  items;
  corporates;

  challengeStatus = [...[{ name: 'Todos', value: '' }], ...CHALLENGE_STATUSES];
  challengeTypes = [...[{ name: 'Todos', value: '' }], ...CHALLENGE_TYPES];

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
  tableConfig: TableConfig
  // END CONFIG TABLE

  role;
  corporateId;

  constructor(
    private challengeService: ChallengeService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId();

    if (this.role == "MANAGER") {
      this.filter = `{"instance.status": "ACTIVE", "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"instance.status": "ACTIVE"}`;
    }

    this.sort = '';
    this.getChallenges();
    this.getCorporates();
    this.countChallenges();
  }

  ngOnInit() { }

  filterFormChanges(values) {
    this.createFilter(values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countChallenges();
  }

  createFilter(filterValues) {
    let startUnixDate;
    let endUnixDate;

    if (filterValues.rawValues.startDate) {
      const startDate = filterValues.rawValues.startDate;
      startUnixDate = startDate.getTime();
      // startUnixDate = moment(startUnixDate).add(2, 'h');
    }

    if (filterValues.rawValues.endDate) {
      const endDate = filterValues.rawValues.endDate;
      endUnixDate = endDate.getTime();
      // endUnixDate = moment(endUnixDate).add(2, 'h');
    }

    let startFilter

    if (this.role == "MANAGER") {
      startFilter = `{"instance.status": "ACTIVE", "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = `{"instance.status": "ACTIVE"`;
    }

    const corporateFilter = ',"corporateId": "' + filterValues.rawValues.corporateName + '"';
    const nameFilter =
      ',"name.es": {$regex:".*' + filterValues.values.name + '", $options: "i"}';
    const challengeTypeFilter = ',"type": "' + filterValues.values.type + '"';
    const startDateFilter =
      ',"startDate": { $lt: ' +
      moment(startUnixDate).add(1, 'd') +
      ', $gte: ' +
      startUnixDate +
      '}';
    const endDateFilter =
      ',"endDate": { $lt: ' +
      moment(endUnixDate).add(1, 'd') +
      ', $gte: ' +
      endUnixDate +
      '}';
    const fountainStatusFilter =
      ',"status": "' + filterValues.values.status + '",';
    const finishFilter = '}';

    this.filter = startFilter
      .concat(
        filterValues.values.name !== '' && filterValues.values.name !== null
          ? nameFilter
          : ''
      )
      // tslint:disable-next-line: max-line-length
      .concat(
        filterValues.values.type !== '' &&
          filterValues.values.type !== null &&
          filterValues.values.type.length !== 0
          ? challengeTypeFilter
          : ''
      )
      .concat(
        filterValues.rawValues.startDate !== '' &&
          filterValues.rawValues.startDate !== null
          ? startDateFilter
          : ''
      )
      .concat(
        filterValues.rawValues.endDate !== '' &&
          filterValues.rawValues.endDate !== null
          ? endDateFilter
          : ''
      )
      // tslint:disable-next-line:max-line-length
      .concat(
        filterValues.values.status !== '' &&
          filterValues.values.status !== null &&
          filterValues.values.status.length !== 0
          ? fountainStatusFilter
          : ''
      )
      .concat((filterValues.rawValues.corporateName !== '' && filterValues.rawValues.corporateName !== null && filterValues.rawValues.corporateName !== undefined && filterValues.rawValues.corporateName.length !== 0) ? corporateFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getChallenges(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = {
      limit: String(this.paginator.limit),
      sort: this.sort,
      skip: String(this.paginator.skip),
      filter: this.filter
    };
    this.challengeService.getAll(headers).subscribe(
      challenges => {
        this.ngxLoader.stop();
        this.items = [];
        if (challenges !== null) {

          challenges.map((challenge: any) => {

            if (
              !challenge.totalSubscriptions ||
              challenge.totalSubscriptions === null
            ) {
              challenge.totalSubscriptions = 0;
            }
            if (
              !challenge.totalDoneSubscriptions ||
              challenge.totalDoneSubscriptions === null
            ) {
              challenge.totalDoneSubscriptions = 0;
            }

            if (challenge.type) {
              challenge.type = this.changeChallengeTypeName(challenge.type);
            }

            if (challenge.status) {
              challenge.status = this.changeChallengeStatusName(
                challenge.status
              );
            }
          });

          this.items = challenges;

          if (isDeletedItem && challenges.length === 0) {
            this.resetPaginate();
          }
        } else {
          if (isDeletedItem) {
            this.resetPaginate();
          }
        }
      },
      error => {
        this.toastr.error(
          'Ha ocurrido un error al cargar los retos, vuelve a intentarlo',
          'Error'
        );
        this.ngxLoader.stop();
      }
    );
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
          columnDef: 'name',
          columnValue: 'name.es',
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
          columnDef: 'image',
          columnValue: 'imageInfo.fileRoute',
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
          columnDef: 'challengeType',
          headerLabel: 'Tipo de reto',
          columnValue: 'type',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo de reto',
            formControl: {
              name: 'type'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.challengeTypes,
              label: 'name',
              value: 'value'
            }
          }
        },
        {
          columnDef: 'fillsNeeded',
          columnValue: 'fillsNeeded',
          columnType: 'STRING',
          headerLabel: 'Refills requeridos',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Refills requeridos',
            formControl: {
              name: 'fillsNeeded'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'startDate',
          columnValue: 'startDate',
          columnType: 'DATE',
          headerLabel: 'Fecha inicio',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha inicio',
            formControl: {
              name: 'startDate'
            },
            // sortFilterExists: true
            sortFilterExists: false
          }
        },
        {
          columnDef: 'endDate',
          columnValue: 'endDate',
          columnType: 'DATE',
          headerLabel: 'Fecha final',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha final',
            formControl: {
              name: 'endDate'
            },
            // sortFilterExists: true
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalSubscriptions',
          columnValue: 'totalSubscriptions',
          columnType: 'STRING',
          headerLabel: 'Usuarios reto activado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Usuarios reto activado',
            formControl: {
              name: 'totalSubscriptions'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'totalDoneSubscriptions',
          columnValue: 'totalDoneSubscriptions',
          columnType: 'STRING',
          headerLabel: 'Usuarios reto completado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Usuarios reto completado',
            formControl: {
              name: 'totalDoneSubscriptions'
            },
            sortFilterExists: true
          }
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
              items: this.challengeStatus,
              label: 'name',
              value: 'value'
            }
          }
        }
      ]
    } else {
      columns = [
        {
          columnDef: 'name',
          columnValue: 'name.es',
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
          columnDef: 'image',
          columnValue: 'imageInfo.fileRoute',
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
          columnDef: 'challengeType',
          headerLabel: 'Tipo de reto',
          columnValue: 'type',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Tipo de reto',
            formControl: {
              name: 'type'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.challengeTypes,
              label: 'name',
              value: 'value'
            }
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
        {
          columnDef: 'duration',
          columnValue: 'duration',
          columnType: 'STRING',
          headerLabel: 'Duración reto (días)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Duración reto (días)',
            formControl: {
              name: 'duration'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'closcaPoints',
          columnValue: 'closcaPoints',
          columnType: 'STRING',
          headerLabel: 'Recompensa (Refill Coins)',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Recompensa (Refill Coins)',
            formControl: {
              name: 'closcaPoints'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'fillsNeeded',
          columnValue: 'fillsNeeded',
          columnType: 'STRING',
          headerLabel: 'Refills requeridos',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Refills requeridos',
            formControl: {
              name: 'fillsNeeded'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'hydrationFillsNeeded',
          columnValue: 'hydrationFillsNeeded',
          columnType: 'STRING',
          headerLabel: 'Rellenos de hidratación requeridos',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Rellenos de hidratación requeridos',
            formControl: {
              name: 'hydrationFillsNeeded'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'fountainsCreatedNeeded',
          columnValue: 'fountainsCreatedNeeded',
          columnType: 'STRING',
          headerLabel: 'Fuentes creadas requeridas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Fuentes creadas requeridas',
            formControl: {
              name: 'fountainsCreatedNeeded'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'fountainsRatedNeeded',
          columnValue: 'fountainsRatedNeeded',
          columnType: 'STRING',
          headerLabel: 'Fuentes valoradas requeridas',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Fuentes valoradas requeridas',
            formControl: {
              name: 'fountainsRatedNeeded'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'startDate',
          columnValue: 'startDate',
          columnType: 'DATE',
          headerLabel: 'Fecha inicio',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha inicio',
            formControl: {
              name: 'startDate'
            },
            // sortFilterExists: true
            sortFilterExists: false
          }
        },
        {
          columnDef: 'endDate',
          columnValue: 'endDate',
          columnType: 'DATE',
          headerLabel: 'Fecha final',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha final',
            formControl: {
              name: 'endDate'
            },
            // sortFilterExists: true
            sortFilterExists: false
          }
        },
        {
          columnDef: 'totalSubscriptions',
          columnValue: 'totalSubscriptions',
          columnType: 'STRING',
          headerLabel: 'Usuarios reto activado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Usuarios reto activado',
            formControl: {
              name: 'totalSubscriptions'
            },
            sortFilterExists: true
          }
        },
        {
          columnDef: 'totalDoneSubscriptions',
          columnValue: 'totalDoneSubscriptions',
          columnType: 'STRING',
          headerLabel: 'Usuarios reto completado',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Usuarios reto completado',
            formControl: {
              name: 'totalDoneSubscriptions'
            },
            sortFilterExists: true
          }
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
              items: this.challengeStatus,
              label: 'name',
              value: 'value'
            }
          }
        }
      ]
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: {
        metricsButton: true,
        viewButton: true,
        editButton: true,
        newButton: false,
        deleteButton: true,
        baseRouterLink: this.routerDefinitions.challenges
      },
      columns: columns
    };
  }

  countChallenges() {
    const headers = {
      filter: this.filter
    };
    this.challengeService.count(headers).subscribe(response => {
      if (response !== null) {
        this.paginator.length = response;
      } else {
        this.paginator.length = 0;
      }
    });
  }

  changeChallengeStatusName(challengeStatus: any) {
    let result;
    switch (challengeStatus) {
      case 'ACTIVE':
        result = 'Activo';
        break;
      case 'INACTIVE':
        result = 'Inactivo';
        break;
      case 'FINISHED':
        result = 'Finalizado';
        break;
    }
    return result;
  }

  changeChallengeTypeName(challengeType: any) {
    let result;
    switch (challengeType) {
      case 'HABIT':
        result = 'Hábito';
        break;
      case 'LOCATION':
        result = 'Localización';
        break;
      case 'LIMITED_WINNERS':
        result = 'Ganadores Limitados';
        break;
    }
    return result;
  }

  deleteItem(item) {
    // Uncomment when there are instance.status
    if (item.status === 'ACTIVE') {
      this.toastr.error('No se puede borrar un reto activo', 'Aviso');
    } else {
      this.challengeService
        .delete(item._id, { 'Accept-language': 'es' })
        .subscribe(
          response => {
            this.toastr.success(
              'El reto ha sido borrado correctamente',
              'Listo'
            );
            this.countChallenges();
            this.getChallenges(true);
          },
          error => {
            this.toastr.error(
              'Ha ocurrido un error al intentar borrar el reto',
              'Error'
            );
          }
        );
    }
  }

  paginate(value) {
    this.getChallenges();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getChallenges();
  }
}
