import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from 'src/app/shared/custom-gnommo-base/services/reports.service';
import { FountainService } from 'src/app/shared/custom-gnommo-base/services/fountain.service';
import { CorporateService } from 'src/app/shared/custom-gnommo-base/services/corporate.service';
import { ToastrService } from 'ngx-toastr';
import { Report } from 'src/app/shared/custom-gnommo-base/models/report.model';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { REPORT_TYPES, PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES, S3_URL } from 'src/app/shared/constants/constants';
import { Fountain } from 'src/app/shared/custom-gnommo-base/models';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';

declare var google;

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportDetailComponent implements OnInit {
  reportForm: FormGroup;
  reportId;
  report;
  corporates;
  fountainId;
  reportDate;

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  // ENUMS
  reportTypeOptions = REPORT_TYPES;

  fountainTypeOptions = PUBLIC_OR_PRIVATE_FOUNTAIN_TYPES;

  // GEOINFO TO SAVE WHEN CHANGE MARKER OR SEARCH OTHER ADDRESS
  geoInfoToSave = null;

  reportStatusSelected;

  action: string;

  role;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private fountainService: FountainService,
    private corporateService: CorporateService,
    private loggedUserService: LoggedUserService,
    private ngxLoader: NgxUiLoaderService,
    private _location: Location,
    private toastr: ToastrService
  ) {
    this.role = this.loggedUserService.getRole();

    this.reportId = this.activatedRoute.snapshot.params['id'];
    this.action = this.activatedRoute.snapshot.url[0].path;

    switch (this.action) {
      case 'view':
        this.buildForm(true);
        break;

      case 'edit':
        this.buildForm(false);
        break;

    }

    this.getCorporates();
    this.getReportById(this.reportId);
  }

  ngOnInit() {
  }

  buildForm(disabled) {
    this.reportForm = this.formBuilder.group({
      reportStatus: [{ value: 'PENDING', disabled: disabled }],
      reportType: [{ value: null, disabled: true }],
      text: [{ value: null, disabled: true }],
      userInfo: this.formBuilder.group({
        email: [{ value: null, disabled: true }],
        userName: [{ value: null, disabled: true }]
      }),
      fountainInfo: this.formBuilder.group({
        name: [{ value: null, disabled: true }],
        fountainType: [{ value: null, disabled: true }],
        address: this.formBuilder.group({
          address: [{ value: null, disabled: true }],
        })
      }),
      // corporateInfo: this.formBuilder.group({
      //   _id: [{ value: null, disabled: true }],
      //   code: [{ value: null, disabled: true }]
      // }),
      newAddress: [{ value: null, disabled: true }],
      currentAddress: [{ value: null, disabled: true }]
    });
  }

  getCorporates() {
    this.corporateService
      .getAll()
      .subscribe((response) => {
        this.ngxLoader.stop();
        this.corporates = [];
        if (response !== null) {
          this.corporates = response;

        }
      },
        (error: Error) => {
          this.toastr.error('Ha ocurrido un error al cargar las corporaciones, vuelve a intentarlo', 'Error');
          this.ngxLoader.stop();
        });
  }

  getReportById(reportId: string) {
    this.reportService
      .getById(reportId)
      .subscribe(
        (report: Report) => {
          this.report = report;

          this.fountainId = report.fountainId;
          let date = report.instance.createdAt;
          this.reportDate = new Date(date as any);
          this.reportForm.patchValue(report);

          this.reportForm.get('newAddress').setValue(report.address.address + ", " + report.address.postalCode + " " + report.address.town + ", " + report.address.province + ", " + report.address.country);
          this.reportForm.get('currentAddress').setValue(report.fountainInfo.address.address + ", " + report.fountainInfo.address.postalCode + " " + report.fountainInfo.address.town + ", " + report.fountainInfo.address.province + ", " + report.fountainInfo.address.country);

        }
      );
  }

  updateFountainImage() {
    this.ngxLoader.start();

    var newFountain: any = {
      imageId: this.report.imageId
    };

    this.fountainService
      .update(this.report.fountainId, newFountain, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.stop();
          this._location.back();
          this.toastr.success('Fuente actualizada con exito', 'Listo');
        },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        }
      );
  }

  updateFountainAddress() {
    this.ngxLoader.start();

    var newFountain: any = {
      loc: this.report.loc,
      address: this.report.address,
      geoInfo: this.report.geoInfo
    };

    this.fountainService
      .update(this.report.fountainId, newFountain, { 'Accept-language': 'es' })
      .subscribe(
        (response) => {
          this.ngxLoader.stop();
          this._location.back();
          this.toastr.success('Fuente actualizada con exito', 'Listo');
        },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un problema al actualizar la fuente', 'Error');
        }
      );
  }

  sendFeedbackEmail() {
    let headers: any = {
      'Accept-Language': this.report.userInfo.config.language
    };

    let emailInfo: any = {
      'emailUser': this.report.userInfo.email,
      'userName': this.report.userInfo.userName,
      'fountainAddress': this.report.fountainInfo.address.address + ", " + this.report.fountainInfo.address.postalCode + " " + this.report.fountainInfo.address.town + ", " + this.report.fountainInfo.address.province + ", " + this.report.fountainInfo.address.country
    };

    this.reportService
      .sendFeedbackEmail(this.report._id, emailInfo, headers)
      .subscribe(
        (response) => {
          this.ngxLoader.stop();
          this._location.back();
          this.toastr.success('Feedback enviado con exito', 'Listo');
        },
        error => {
          this.ngxLoader.stop();
          this.toastr.error('Ha ocurrido un problema al enviar el feedback', 'Error');
        }
      );
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  onReportStatusChange(value) {
    this.reportStatusSelected = value
  }

  saveForm(values, valid) {
    if (valid) {
      this.ngxLoader.start();

      var newReport: any = {
        reportStatus: this.reportStatusSelected
      };

      this.reportService
        .update(this.report._id, newReport, { 'Accept-language': 'es' })
        .subscribe(
          (response) => {
            this.ngxLoader.stop();
            this._location.back();
            this.toastr.success('Reporte actualizado con exito', 'Listo');
          },
          error => {
            this.ngxLoader.stop();
            this.toastr.error('Ha ocurrido un problema al actualizar el Reporte', 'Error');
          }
        );

    }
  }

}
