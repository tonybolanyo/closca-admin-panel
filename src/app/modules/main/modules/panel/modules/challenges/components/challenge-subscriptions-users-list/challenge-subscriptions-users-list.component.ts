import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ChallengeSubscriptionService } from 'src/app/shared/custom-gnommo-base/services';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Challenge, ChallengeSubscription } from 'src/app/shared/custom-gnommo-base/models';
@Component({
  selector: 'app-challenge-subscriptions-users-list',
  templateUrl: 'challenge-subscriptions-users-list.component.html',
  styleUrls: ['./challenge-subscriptions-users-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class ChallengeSubscriptionsUsersListComponent implements OnInit {
  @Input('challengeId') challengeId: string;
  @Input('challenge') challenge: Challenge;

  @Input('role') role: string;

  // START USERS
  filter = {};

  usersSubscribed = [];
  // END USERS


  challengeStatusses = [
    { name: 'Todos', value: '' },
    { name: 'Activado', value: 'SUSCRIBED' },
    { name: 'No activado', value: 'UNSUSCRIBED' },
    { name: 'Completado', value: 'DONE' },
    { name: 'Fallido', value: 'FAILED' }
  ];
  filterForm: FormGroup;

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


  filterFormValues;
  sort = null;

  tableConfig: TableConfig;

  constructor(
    private challengeSubscriptionService: ChallengeSubscriptionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.filterForm = this.formBuilder.group({
      userName: [],
      email: [],
      challengeStatus: [],
      date: []
    });
  }

  ngOnInit() {
    let buttonsConfig
    if (this.role != "MANAGER") {
      buttonsConfig = {
        viewButton: false,
        editButton: false,
        deleteUserButton: false,
        deleteChallengeSuscriptionButton: true,
        baseRouterLink: this.routerDefinitions.users
      };
    } else {
      buttonsConfig = null;
    }

    this.tableConfig = {
      filterColumnEnabled: true,
      paginatorExists: true,
      buttonsConfig: buttonsConfig,
      columns: [
        {
          columnDef: 'userName',
          columnValue: 'userInfo.userName',
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
          columnValue: 'userInfo.email',
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
          columnDef: 'challengeStatus',
          headerLabel: 'Reto',
          columnValue: 'challengeStatusTranslate',
          columnType: 'STRING',
          filter: {
            exists: true,
            type: 'DROPDOWN',
            placeholder: 'Reto',
            formControl: {
              name: 'challengeStatus'
            },
            // sortFilterExists: true
            sortFilterExists: false,
            dropdownConfig: {
              items: this.challengeStatusses,
              label: 'name',
              value: 'value'
            }
          },
        },
        {
          columnDef: 'date',
          columnValue: 'instance.createdAt',
          columnType: 'DATE',
          headerLabel: 'Fecha unión',
          filter: {
            exists: true,
            type: 'DATE',
            placeholder: 'Fecha unión',
            formControl: {
              name: 'date'
            },
            // sortFilterExists: true
            sortFilterExists: false
          }
        }
      ]
    };

    this.filter = `{"challengeId": "${this.challengeId}"}`;
    this.sort = 'totalRefilled';

    if (this.challenge.fillsNeeded != undefined) {
      this.tableConfig.columns.push({
        columnDef: 'totalRefilled',
        columnValue: 'totalRefilled',
        columnType: 'STRING',
        headerLabel: 'Número de refills',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Número de refills',
          formControl: {
            name: 'totalRefilled'
          },
          // sortFilterExists: true
          sortFilterExists: false
        }
      });
    }

    if (this.challenge.hydrationFillsNeeded != undefined) {
      this.tableConfig.columns.push({
        columnDef: 'totalHydrationRefilled',
        columnValue: 'totalHydrationRefilled',
        columnType: 'STRING',
        headerLabel: 'Número de rellenos de hidratación',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Número de rellenos de hidratación',
          formControl: {
            name: 'totalHydrationRefilled'
          },
          // sortFilterExists: true
          sortFilterExists: false
        }
      });
    }

    if (this.challenge.fountainsCreatedNeeded != undefined) {
      this.tableConfig.columns.push({
        columnDef: 'fountainsCreated',
        columnValue: 'fountainsCreated',
        columnType: 'STRING',
        headerLabel: 'Fuentes Creadas',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Fuentes Creadas',
          formControl: {
            name: 'fountainsCreated'
          },
          // sortFilterExists: true
          sortFilterExists: false
        }
      });
    }

    if (this.challenge.fountainsRatedNeeded != undefined) {
      this.tableConfig.columns.push({
        columnDef: 'fountainsRated',
        columnValue: 'fountainsRated',
        columnType: 'STRING',
        headerLabel: 'Fuentes Valoradas',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Fuentes Valoradas',
          formControl: {
            name: 'fountainsRated'
          },
          // sortFilterExists: true
          sortFilterExists: false
        }
      });
    }

    if (this.challengeId) {
      this.getUsersSubscribedByChallengeId();
      this.countUsersSubscribedByChallengeId();
    }



  }

  filterFormChanges(values) {
    this.createFilter(values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countUsersSubscribedByChallengeId();
  }


  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }


  // GET SUBSCRIBE CHALLENGE USERS

  getUsersSubscribedByChallengeId() {

    const headers = {
      filter: this.filter,
      includes: 'user',
      sort: this.sort
    };

    this.challengeSubscriptionService
      .getAll(headers)
      .subscribe(
        (response: any[]) => {
          this.usersSubscribed = [];
          if (response) {
            response.map((item) => {
              item.challengeStatusTranslate = this.changeChallengeStatus(item.challengeStatus);
            });
            this.usersSubscribed = response;

          }
        });
  }



  countUsersSubscribedByChallengeId() {
    const headers = {
      filter: this.filter,
      includes: 'user'
    };

    this.challengeSubscriptionService
      .count(headers)
      .subscribe(
        (response) => {
          this.paginator.length = 0;
          if (response) {
            this.paginator.length = response;
          }
        });
  }
  //
  // END USERS
  //



  changeChallengeStatus(challengeStatus: any) {
    let result;
    switch (challengeStatus) {
      case 'SUSCRIBED':
        result = 'Activado';
        break;
      case 'UNSUSCRIBED':
        result = 'No activado';
        break;
      case 'DONE':
        result = 'Completado';
        break;
      case 'FAILED':
        result = 'Fallido';
        break;
    }
    return result;
  }



  createFilter(filterValues) {
    let unixDate;

    if (filterValues.rawValues.date) {
      const date = filterValues.rawValues.date;
      unixDate = date.getTime();
      // startUnixDate = moment(startUnixDate).add(2, 'h');
    }
    const startFilter = `{"challengeId": "${this.challengeId}"`;
    const emailFilter = ',"userInfo.email": {$regex:".*' + filterValues.values.email + '", $options: "i"}';
    const userNameFilter = ',"userInfo.userName": { $regex:".*' + filterValues.values.userName + '", $options: "i"}';
    const dateFilter = ',"instance.createdAt": { $lt: ' + moment(unixDate).add(1, 'd') + ', $gte: ' + unixDate + '}';
    const challengeStatusFilter = ',"challengeStatus": "' + filterValues.values.challengeStatus + '"';
    const finishFilter = '}';

    this.filter = startFilter
      .concat((filterValues.values.email !== '' && filterValues.values.email !== null) ? emailFilter : '')
      .concat((filterValues.values.userName !== '' && filterValues.values.userName !== null) ? userNameFilter : '')
      .concat((filterValues.rawValues.date !== '' && filterValues.rawValues.date !== null) ? dateFilter : '')
      // tslint:disable-next-line:max-line-length
      .concat((filterValues.values.challengeStatus !== '' && filterValues.values.challengeStatus !== null && filterValues.values.challengeStatus.length !== 0) ? challengeStatusFilter : '')
      .concat(finishFilter);
  }

  paginate(event) {
    this.getUsersSubscribedByChallengeId();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getUsersSubscribedByChallengeId();
  }


  customEditNavigate(element) {
    this.router.navigate([this.routerDefinitions.users, 'edit', element.userInfo._id]);
  }

  deleteItem(item) {
    if (item.challengeStatus === 'SUSCRIBED') {
      let challengeSuscriptionToUpdate: ChallengeSubscription = {
        _id: item._id,
        challengeStatus: "FAILED",
        totalRefilled: item.totalRefilled,
        totalHydrationRefilled: item.totalHydrationRefilled,
        fountainsCreated: item.fountainsCreated,
        fountainsRated: item.fountainsRated
      }

      this.challengeSubscriptionService
        .update(item._id, challengeSuscriptionToUpdate)
        .subscribe(
          response => {
            this.toastr.success(
              'La suscripción ha sido finalizada correctamente',
              'Listo'
            );
            this.resetPaginate();
          },
          error => {
            this.toastr.error(
              'Ha ocurrido un error al finalizar la suscripción',
              'Error'
            );
          }
        );
    } else {
      this.toastr.error('La suscripción ya está Finalizada o Completada', 'Aviso');
    }
  }

}
