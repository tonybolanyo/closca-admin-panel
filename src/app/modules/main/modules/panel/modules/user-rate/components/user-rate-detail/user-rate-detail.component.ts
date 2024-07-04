import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES } from 'src/app/shared/constants/constants';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { UserRatingsService } from 'src/app/shared/custom-gnommo-base/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-rate-detail',
  templateUrl: './user-rate-detail.component.html',
  styleUrls: ['./user-rate-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserRateDetailComponent implements OnInit {
  userRate;
  userRateId;
  userRateForm: FormGroup;

  userId;
  fountainId;

  routerDefinitions = ROUTER_DEFINITIONS;
  fountainTypeOptions = PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES;

  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private userRatingService: UserRatingsService,
    private formBuilder: FormBuilder
  ) {
    this.userRateId = this.activatedRoute.snapshot.params['id'];
    this.buildForm();
    this.getUserRatingById();
   }

  ngOnInit() {
  }

  buildForm() {
    this.userRateForm = this.formBuilder.group({
      userInfo: this.formBuilder.group({
        userName: [{ value: null, disabled: true }],
        email: [{ value: null, disabled: true }],
        phoneNumber: [{ value: null, disabled: true }],
        rating: [[{ value: null, disabled: true }]]
      }),
      fountainInfo: this.formBuilder.group({
        name: [{ value: null, disabled: true }],
        address: this.formBuilder.group({
          address: [{ value: null, disabled: true }]
        }),
        fountainType: [{ value: null, disabled: true }]
      })
    });
  }

  getUserRatingById() {
    this.ngxLoader.start();

    this.userRatingService
    .getById(this.userRateId)
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.userId = response.userId;
      this.fountainId = response.fountainId;

      this.userRateForm.patchValue(response);
    },
    error => {
        this.toastr.error('Ha ocurrido un error al cargar la valoración, vuelve a intentarlo', 'Error');
        this.ngxLoader.stop();
    })
  }

  navigateBack() {
    this._location.back();
  }

}
