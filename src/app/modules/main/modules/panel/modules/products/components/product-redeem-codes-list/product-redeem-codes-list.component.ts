import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { TableConfig } from 'src/app/shared/interfaces/tableConfig.interface';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RewardService } from 'src/app/shared/custom-gnommo-base/services';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-product-redeem-codes-list',
  templateUrl: './product-redeem-codes-list.component.html',
  styleUrls: ['./product-redeem-codes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductRedeemCodesListComponent implements OnInit {
  @Input('productId') productId: string;

  // START USERS
  filter: any = {};

  codesRedeemed = [];
  // END USERS

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

  // CONFIG TABLE
  tableConfig: TableConfig = {
    filterColumnEnabled: true,
    paginatorExists: true,
    buttonsConfig: {
      viewButton: false,
      editButton: false,
      newButton: false,
      deleteButton: false
    },
    columns: [
      {
        columnDef: 'name',
        columnValue: 'userInfo.userName',
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
        columnDef: 'email',
        columnValue: 'userInfo.email',
        columnType: 'STRING',
        headerLabel: 'Email',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Email',
          formControl: {
            name: 'email'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'rewardCode',
        columnValue: 'rewardCode',
        columnType: 'STRING',
        headerLabel: 'Código canjeado',
        filter: {
          exists: true,
          type: 'INPUT',
          placeholder: 'Código canjeado',
          formControl: {
            name: 'rewardCode'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'redeemDate',
        columnValue: 'instance.createdAt',
        columnType: 'DATE',
        headerLabel: 'Fecha canjeo',
        filter: {
          exists: true,
          type: 'DATE',
          placeholder: 'Fecha canjeo',
          formControl: {
            name: 'redeemDate'
          },
          sortFilterExists: false
        }
      },
      {
        columnDef: 'closcaPoints',
        columnValue: 'userInfo.closcaPoints',
        columnType: 'STRING',
        headerLabel: 'Refill Coins',
        filter: {
          exists: false,
          type: 'INPUT',
          placeholder: 'Refill Coins',
          formControl: {
            name: 'closcaPoints'
          },
          sortFilterExists: false
        }
      }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private rewardService: RewardService,
    private loader: NgxUiLoaderService,
    private router: Router,
  ) {
    this.filterForm = this.formBuilder.group({
      name: [],
      email: [],
      rewardCode: [],
      redeemDate: [],
      closcaPoints: []
    });
   }

  ngOnInit() {
    this.filter = `{"productId": "${this.productId}"}`;
    this.sort = '';

    if (this.productId) {
      this.getRewardsByProductId();
      this.countRewardsByProductId();
    }
  }

  filterFormChanges(values) {
    this.createFilter(values);
    this.createSort(values.sortValues);
    this.resetPaginate();
    this.countRewardsByProductId();
  }

  createSort(sortValues) {
    if (sortValues) {
      this.sort = sortValues;
    }
  }

  getRewardsByProductId() {
    this.loader.start();

    const headers = {
      limit: String(this.paginator.limit),
      skip: String(this.paginator.skip),
      filter: this.filter
    };

    this.rewardService
      .getRewardByProduct(this.productId, headers)
      .subscribe(
        (response: any[]) => {
          this.loader.stop();
          this.codesRedeemed = [];
          if (response) {
            this.codesRedeemed = response;
          }
        });
  }

  countRewardsByProductId() {
    const headers = {
      filter: this.filter
    };

    this.rewardService
      .getRewardByProduct(this.productId, headers)
      .subscribe(
        (response) => {
          this.paginator.length = 0;
          if (response) {
            this.paginator.length = response.length;
          }
        });
  }

  createFilter(filterValues) {
    let unixDate;
    if (filterValues.rawValues.redeemDate) {
      const date = filterValues.rawValues.redeemDate;
      unixDate = date.getTime();
    }

    const startFilter = '{"instance.status":"ACTIVE"';
    const nameFilter = ',"userInfo.userName": {$regex:".*' + filterValues.values.name + '", $options: "i"}';
    const emailFilter = ',"userInfo.email": {$regex:".*' + filterValues.values.email + '", $options: "i"}';
    const codeFilter = ',"rewardCode": {$regex:".*' + filterValues.values.rewardCode + '", $options: "i"}';
    const startDateFilter = ',"instance.createdAt": { $lt: ' + moment(unixDate).add(1, 'd');
    const endDateFilter = ',$gte: ' + unixDate + ' }';
    const finishFilter = '}';

    this.filter = startFilter
      .concat(
        filterValues.values.name !== '' && filterValues.values.name !== null
          ? nameFilter
          : ''
      )
      .concat(
        filterValues.values.email !== '' && filterValues.values.email !== null
          ? emailFilter
          : ''
      )
      .concat(
        filterValues.values.rewardCode !== '' && filterValues.values.rewardCode !== null
          ? codeFilter
          : ''
      )
      .concat(
        filterValues.rawValues.redeemDate !== '' &&
          filterValues.rawValues.redeemDate !== null
          ? startDateFilter
          : ''
      )
      .concat(
        filterValues.rawValues.redeemDate !== '' &&
          filterValues.rawValues.redeemDate !== null
          ? endDateFilter
          : ''
      )
      .concat(finishFilter);
  }

  paginate(event) {
    this.getRewardsByProductId();
  }

  resetPaginate() {
    this.paginator.skip = 0;
    this.paginator.pageIndex = 0;
    this.getRewardsByProductId();
  }

  customViewNavigate(element) {
    this.router.navigate([this.routerDefinitions.users, 'view', element.userInfo._id]);
  }

}
