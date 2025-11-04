import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LEVEL_STATUSES } from 'src/app/shared/constants/constants';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { LevelService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';

@Component({
  selector: 'app-levels-list',
  templateUrl: './levels-list.component.html',
  styleUrls: ['./levels-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LevelsListComponent implements OnInit {
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

  levelStatus = [...[{ name: 'Todos', value: '' }], ...LEVEL_STATUSES];

  // CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: true,
    paginatorExists: true,
    buttonsConfig: {
      viewButton: true,
      editButton: true,
      newButton: false,
      deleteButton: true,
      baseRouterLink: this.routerDefinitions.levels
    },
    columns: [
      {
        columnDef: 'code',
        columnValue: 'code',
        columnType: 'STRING',
        headerLabel: 'Nombre interno',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Nombre interno',
          formControl: {
            name: 'code'
          },
          sortFilterExists: false,
        }
      },
      {
        columnDef: 'name.es',
        columnValue: 'name.es',
        columnType: 'STRING',
        headerLabel: 'Nombre',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Nombre',
          formControl: {
            name: 'name.es'
          },
          sortFilterExists: false,
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
            items: this.levelStatus,
            label: 'name',
            value: 'value'
          }
        },
      },
      {
        columnDef: 'minRefills',
        columnValue: 'minRefills',
        columnType: 'STRING',
        headerLabel: 'Valor Inferior',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Valor Inferior',
          formControl: {
            name: 'minRefills'
          },
          sortFilterExists: true,
        }
      },
      {
        columnDef: 'maxRefills',
        columnValue: 'maxRefills',
        columnType: 'STRING',
        headerLabel: 'Valor Superior',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Valor Superior',
          formControl: {
            name: 'maxRefills'
          },
          sortFilterExists: true,
        }
      },
      {
        columnDef: 'refillReward',
        columnValue: 'refillReward',
        columnType: 'STRING',
        headerLabel: 'Recompensas - Refill',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Recompensas - Refill',
          formControl: {
            name: 'refillReward'
          },
          sortFilterExists: true,
        }
      },
      {
        columnDef: 'fountainCreationReward',
        columnValue: 'fountainCreationReward',
        columnType: 'STRING',
        headerLabel: 'Recompensas - Creación de fuentes',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Recompensas - Creación de fuentes',
          formControl: {
            name: 'fountainCreationReward'
          },
          sortFilterExists: true,
        }
      },
    ]
  };
  // END CONFIG TABLE

  constructor(
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private levelService: LevelService
  ) {
    this.filter = `{ "instance.status": { $ne: "DELETED" } }`;
    this.sort = 'instance.createdAt';
    this.getLevels();
    this.countLevels();
  }

  ngOnInit() {
  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countLevels();
  }

  createFilter(filterValues) {
    const startFilter = '{ "instance.status": { $ne: "DELETED" }';
    const nameFilter = ',"name": {$regex:".*' + filterValues.name + '", $options: "i"}';
    const codeFilter = ',"code": {$regex:".*' + filterValues.code + '", $options: "i"}';
    const statusFilter = ',"status": "' + filterValues.status + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.name !== '' && filterValues.name !== null) ? nameFilter : '')
      .concat((filterValues.code !== '' && filterValues.code !== null) ? codeFilter : '')
      .concat((filterValues.status !== '' && filterValues.status !== null) ? statusFilter : '')
      .concat(finishFilter);
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getLevels() {
    this.ngxLoader.start();
    const headers = convertToHttpHeaderMap({
      limit: this.paginator.limit,
      sort: this.sort,
      skip: String(this.paginator.skip),
      filter: this.filter
    });
    this.levelService
      .getAll(headers)
      .subscribe((levels) => {
        this.ngxLoader.stop();

        if (levels != undefined) {
          levels.map((level: any) => {

            if (level.minRefills == undefined) {
              level.minRefills = 0
            }

            level.status = this.changeLevelStatusName(level.status);
          });
        }

        this.items = levels;
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al cargar los niveles, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  countLevels() {
    const headers = convertToHttpHeaderMap({
      filter: this.filter
    });
    this.levelService
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
    this.levelService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe((response) => {
        this.toastr.success('El nivel ha sido borrado correctamente', 'Listo');
        this.countLevels();
        this.getLevels();
      },
        (error) => {
          this.toastr.error('Ha ocurrido un error al intentar borrar el nivel', 'Error');
        });
  }

  paginate(value) {
    this.getLevels();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getLevels();
  }

  changeLevelStatusName(levelStatus: any) {
    let result;
    switch (levelStatus) {
      case 'ACTIVE':
        result = 'Activo';
        break;
      case 'INACTIVE':
        result = 'Inactivo';
        break;
    }
    return result;
  }

}
