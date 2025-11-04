import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { Corporate } from 'src/app/shared/custom-gnommo-base/models/corporate.model';
import { Level } from 'src/app/shared/custom-gnommo-base/models/level.model';
import { CorporateService, LevelService, UserService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent implements OnInit {
  items;
  corporates;
  levels;
  fountainsCreated;

  // FILTER
  filter = {};
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
    private levelService: LevelService,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId()
    if (this.role == "MANAGER") {
      this.filter = `{"role": "USER", "instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")}`;
    } else {
      this.filter = `{"role": "USER", "instance.status": {$ne: "DELETED"}}`;
    }
    this.sort = 'instance.createdAt';
    this.getUsers();
    this.getCorporates();
    // this.getLevels();
    this.countUsers();
  }

  ngOnInit() {

  }

  filterFormChanges(values) {
    this.createFilter(values.values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countUsers();
  }

  createFilter(filterValues) {
    let startFilter
    if (this.role == "MANAGER") {
      startFilter = `{"role": "USER", "instance.status": {$ne: "DELETED"}, "corporateId": ObjectId("` + this.corporateId + `")`;
    } else {
      startFilter = '{"role": "USER", "instance.status": {$ne: "DELETED"}';
    }
    const emailFilter = ',"email": {$regex:".*' + filterValues.email + '", $options: "i"}';
    const userNameFilter = ',"userName": { $regex:".*' + filterValues.userName + '", $options: "i"}';
    const corporateFilter = ',"corporateId": "' + filterValues.corporateName + '"';
    const levelFilter = ',"levelId": "' + filterValues.level + '"';
    const finishFilter = '}';

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

  getUsers(isDeletedItem: boolean = false) {
    this.ngxLoader.start();
    const headers = convertToHttpHeaderMap({
      limit: this.paginator.limit,
      skip: this.paginator.skip,
      sort: this.sort,
      filter: this.filter
    });
    this.userService
      .getAll(headers)
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

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        if (response !== null) {
          this.corporates = response;
          this.corporates.unshift(new Corporate("", "Todas"));

          // this.setupTableConfig();
        }

        this.getLevels();
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
          this.getLevels();
        });
  }

  getLevels() {
    this.levelService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();

        if (response !== null) {
          this.levels = response;
          this.levels.unshift(new Level("", "Todos"));

        }

        this.setupTableConfig();
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar los niveles, vuelve a intentarlo', 'Error');
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

  deleteItem(item) {
    this.userService
      .delete(item._id, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.toastr.success('El usuario ha sido borrado correctamente', 'Listo');
          this.countUsers();
          this.getUsers(true);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un problema al intentar borrar el usuario', 'Error');
        }
      );

  }

  paginate(value) {
    this.getUsers();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getUsers();


  }

  setupTableConfig() {
    let columns
    let buttonsConfig

    if (this.role == "MANAGER") {
      columns = [
        {
          columnDef: 'userName',
          columnValue: 'userName',
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
          columnDef: 'email',
          columnValue: 'email',
          columnType: 'STRING',
          headerLabel: 'Email',
          filter: {
            exists: true,
            type: 'INPUT',
            placeholder: 'Email',
            formControl: {
              name: 'email'
            },
            sortFilterExists: false,
          },
        },
      ]

      buttonsConfig = null
    } else {
      columns = [
        {
          columnDef: 'userName',
          columnValue: 'userName',
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
          columnDef: 'email',
          columnValue: 'email',
          columnType: 'STRING',
          headerLabel: 'Email',
          filter: {
            exists: true,
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
        // {
        //   columnDef: 'totalFountains',
        //   columnValue: 'totalFountains',
        //   columnType: 'STRING',
        //   headerLabel: 'Fuentes creadas',
        //   filter: {
        //     exists: false,
        //     type: 'INPUT',
        //     placeholder: 'Fuentes creadas',
        //     formControl: {
        //       name: 'totalFountains'
        //     },
        //     sortFilterExists: true,
        //   },
        // },
        {
          columnDef: 'closcaPoints',
          columnValue: 'closcaPoints',
          columnType: 'STRING',
          headerLabel: 'Refill Coins',
          filter: {
            exists: false,
            type: 'INPUT',
            placeholder: 'Refill Coins',
            formControl: {
              name: 'closcaPoints'
            },
            sortFilterExists: true
          }
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
          columnDef: 'level',
          columnValue: 'levelInfo.code',
          columnType: 'STRING',
          headerLabel: 'Nivel',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Nivel',
            formControl: {
              name: 'level'
            },
            sortFilterExists: false,
            dropdownConfig: {
              items: this.levels,
              label: 'code',
              value: '_id'
            }
          },
        },
      ]

      buttonsConfig = {
        viewButton: true,
        editButton: true,
        deleteUserButton: true,
        baseRouterLink: this.routerDefinitions.users
      }
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: buttonsConfig,
      columns: columns
    };

    this.tableReady = true;
  }
}
