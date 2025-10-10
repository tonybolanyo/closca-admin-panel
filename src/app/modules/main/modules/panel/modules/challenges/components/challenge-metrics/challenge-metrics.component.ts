import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  ChallengeService,
  CorporateService
} from 'src/app/shared/custom-gnommo-base/services';
import {
  S3_URL
} from 'src/app/shared/constants/constants';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { LoggedUserService } from '../../../../../../../../shared/services/logged-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  stroke: ApexStroke;
  markers: ApexMarkers;
  colors: string[];
};

@Component({
  selector: 'app-challenge-metrics',
  styleUrls: ['./challenge-metrics.component.scss'],
  templateUrl: 'challenge-metrics.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ChallengeMetricsComponent implements OnInit {
  challengeId;
  challenge;
  ranking;
  metrics;

  filterForm: UntypedFormGroup;

  startDateTimestamp;
  finishDateTimestamp;

  rankingDisplayedColumns: string[] = ['position', 'userName', 'points'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  role;
  corporateId;

  // chart options
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  showChart = false;
  corporateColor = "#375580";

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private challengeService: ChallengeService,
    private corporateService: CorporateService,
    private _location: Location,
    private loggedUserService: LoggedUserService
  ) {
    this.role = this.loggedUserService.getRole();
    this.corporateId = this.loggedUserService.getCorporateId();

    this.challengeId = this.activatedRoute.snapshot.params['id'];
    this.buildForm();
    this.getChallengeById(this.challengeId);
    this.getChallengeRanking(this.challengeId);

    if (this.role == "MANAGER") {
      this.getCorporateById(this.corporateId)
    } else {
      this.getChallengeMetrics(this.challengeId)
    }
  }

  ngOnInit() {
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      startDate: [{ value: null, disabled: false }],
      finishDate: [{ value: null, disabled: false }],
    });
  }

  navigateBack() {
    this._location.back();
  }

  getChallengeById(challengeId: string) {
    this.challengeService.getById(challengeId).subscribe((challenge: any) => {
      this.challenge = challenge;
    });
  }

  getChallengeMetrics(challengeId: string) {
    this.ngxLoader.start();

    let headers = null
    if (this.startDateTimestamp && this.finishDateTimestamp) {
      headers = {
        startDate: this.startDateTimestamp,
        finishDate: this.finishDateTimestamp,
      };
    }

    this.challengeService.getMetrics(challengeId, headers).subscribe((metrics: any) => {
      this.ngxLoader.stop();
      this.metrics = metrics;

      if (this.metrics.totalTurtle) {
        this.metrics.totalTurtle = Number((this.metrics.totalTurtle).toFixed(2));
      } else {
        this.metrics.totalTurtle = 0
      }

      if (this.metrics.totalCO2Grams) {
        this.metrics.totalCO2Grams = Number((this.metrics.totalCO2Grams).toFixed(2));
      } else {
        this.metrics.totalCO2Grams = 0
      }

      if (this.metrics.totalEuros) {
        this.metrics.totalEuros = Number((this.metrics.totalEuros).toFixed(2));
      } else {
        this.metrics.totalEuros = 0
      }

      if (!this.metrics.totalSubscriptions) {
        this.metrics.totalSubscriptions = 0
      }

      if (!this.metrics.totalActiveSubscriptions) {
        this.metrics.totalActiveSubscriptions = 0
      }

      if (!this.metrics.totalDoneSubscriptions) {
        this.metrics.totalDoneSubscriptions = 0
      }

      if (!this.metrics.totalGrams) {
        this.metrics.totalGrams = 0
      }

      if (!this.metrics.totalRefills) {
        this.metrics.totalRefills = 0
      }

      if (!this.metrics.totalWatts) {
        this.metrics.totalWatts = 0
      }

      var series = [];
      var maxValue = this.metrics.newUsersData[0].value
      this.metrics.newUsersData.forEach(element => {
        if (element.value > maxValue) {
          maxValue = element.value
        }
        series.push([element.date, element.value]);
      });

      this.chartOptions1 = {
        series: [
          {
            name: "Nuevos usuarios",
            data: series
          }
        ],
        chart: {
          id: "chart2",
          type: "bar",
          height: 500,
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        colors: [this.corporateColor],
        stroke: {
          width: 3
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          opacity: 1
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: 'dd/MM/yyyy'
          },
        }

      };

      this.chartOptions2 = {
        series: [
          {
            name: "Nuevos usuarios",
            data: series
          }
        ],
        chart: {
          id: "chart1",
          height: 130,
          type: "bar",
          brush: {
            target: "chart2",
            enabled: true
          },
          selection: {
            enabled: true,
            xaxis: {
              min: this.metrics.newUsersData[0].date - (12 * 60 * 60 * 1000),
              max: this.metrics.newUsersData[this.metrics.newUsersData.length - 1].date + (12 * 60 * 60 * 1000)
            }
          }
        },
        colors: [this.corporateColor],
        fill: {
          opacity: 1
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: 'dd/MM/yy'
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          forceNiceScale: true,
          tickAmount: maxValue,
          min: 0,
          max: maxValue
        }
      };

      this.showChart = true;
    },
      error => {
        this.ngxLoader.stop();
        this.toastr.error(
          'Ha ocurrido un error al intentar obtener las métricas',
          'Error'
        );
      });
  }

  getChallengeRanking(challengeId: string) {
    this.challengeService.getRanking(challengeId).subscribe((ranking: any) => {
      this.ranking = ranking;

      this.ranking.forEach((suscription, index) => {
        suscription.position = index + 1
      });

      this.ranking = new MatTableDataSource<any>(this.ranking);
      this.ranking.paginator = this.paginator;
    },
      error => {
        this.toastr.error(
          'Ha ocurrido un error al intentar obtener el ranking',
          'Error'
        );
      });
  }

  getCorporateById(corporateId) {
    this.corporateService
      .getById(corporateId)
      .subscribe(
        (corporate: any) => {
          this.corporateColor = corporate.color

          this.getChallengeMetrics(this.challengeId)
        },
        error => {
          this.toastr.error(
            'Ha ocurrido un error al intentar obtener la corporación',
            'Error'
          );
        }
      );
  }

  getBase64(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  getImage(fileKey): string {
    return S3_URL + fileKey;
  }

  saveForm(values) {
    if (values.startDate == null && values.finishDate == null) {
      this.startDateTimestamp = null
      this.finishDateTimestamp = null

      this.getChallengeMetrics(this.challengeId)
      return;
    }


    if (values.startDate == null || values.finishDate == null) {
      this.toastr.error(
        'Debes introducir un rango de fechas valido',
        'Aviso'
      );

      return;
    }

    let startDateTimestamp = moment(values.startDate)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toDate()
      .getTime();

    let finishDateTimestamp = moment(values.finishDate)
      .set({ hour: 23, minute: 59, second: 0, millisecond: 0 })
      .toDate()
      .getTime();


    if (startDateTimestamp >= finishDateTimestamp) {
      this.toastr.error(
        'La fecha de inicio no puede ser mayor a la fecha de fin',
        'Aviso'
      );

      return;
    }

    let timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000

    this.startDateTimestamp = startDateTimestamp - timeZoneOffset
    this.finishDateTimestamp = finishDateTimestamp - timeZoneOffset

    this.getChallengeMetrics(this.challengeId)
  }

  downloadCSV() {
    let metricsJSONtoExport = JSON.parse(
      JSON.stringify(
        [this.metrics],
        [
          "totalSubscriptions",
          "totalDoneSubscriptions",
          "totalActiveSubscriptions",
          "totalRefills",
          "totalGrams",
          "totalEuros",
          "totalCO2Grams",
          "totalTurtle",
          "totalWatts"
        ], 4
      )
    );

    this.exportCSVFile(
      [
        "Usuarios en el reto",
        "Usuarios reto completado",
        "Usuarios reto activo",
        "Total Refills",
        "Plástico ahorrado (gr)",
        "Dinero ahorrado (€)",
        "CO2 ahorrado (gr)",
        "Tortugas salvadas",
        "Energía ahorrada (w)"
      ],
      metricsJSONtoExport,
      "Metricas_Reto_" + this.challenge.name.es
    );

    let rankingJSONtoExport = JSON.parse(
      JSON.stringify(
        this.ranking.data,
        [
          "position",
          "userName",
          "points"
        ], 4
      )
    );

    this.exportCSVFile(
      [
        "Posición",
        "Nombre",
        "Puntos",
      ],
      rankingJSONtoExport,
      "Ranking_Reto_" + this.challenge.name.es
    );
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
