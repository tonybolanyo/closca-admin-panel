import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ROUTER_DEFINITIONS } from 'src/app/shared/constants/router-definitions';
import { ChallengeService } from 'src/app/shared/custom-gnommo-base/services';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import clonedeep from 'lodash.clonedeep';
import { S3_URL, CHALLENGE_STATUSES, CHALLENGE_TYPES } from 'src/app/shared/constants/constants';
import { Observable } from 'rxjs';
import { CanDeactivateDialogService } from 'src/app/shared/services/can-deactivate-dialog.service';

@Component({
  selector: 'app-challenges-order',
  templateUrl: './challenges-order.component.html',
  styleUrls: ['./challenges-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChallengesOrderComponent implements OnInit {
  @ViewChild('table1') table1: MatTable<any>;
  @ViewChild('list1') list1: CdkDropList;
  displayedColumns: string[] = ['drag', 'name', 'image', 'closcaPoints', 'type', 'status'];
  dataSource;
  ELEMENT_DATA;
  orderChanges;

  // ROUTER DEFINITIONS
  routerDefinitions = ROUTER_DEFINITIONS;

  challengeStatus = [...[{ name: 'Todos', value: '' }], ...CHALLENGE_STATUSES];
  challengeTypes = [...[{ name: 'Todos', value: '' }], ...CHALLENGE_TYPES];

  constructor(
    private challengeService: ChallengeService,
    private toastr: ToastrService,
    private canDeactivateDialogService: CanDeactivateDialogService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.getChallengeOrder();
  }

  ngOnInit() { }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.orderChanges) {
        return this.canDeactivateDialogService.openDialog();
    }
    return true;
}

  getChallengeOrder() {
    this.ngxLoader.start();
    this.challengeService
    .getAll()
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    },
    error => {
      this.ngxLoader.stop();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.orderChanges = true;

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    // updates moved data and table, but not dynamic if more dropzones
    this.dataSource.data = clonedeep(this.dataSource.data);

    for (let index = 0; index < this.dataSource.data.length; index++) {
      this.dataSource.data[index].order = index + 1;
    }
  }

  getImage(value) {
    return S3_URL + value;
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
    }
    return result;
  }

  updateOrder() {
    this.ngxLoader.start();
    this.challengeService
    .updateOrder(this.dataSource.data)
    .subscribe((response) => {
      this.ngxLoader.stop();
      this.toastr.success('Se ha cambiado el orden correctamente', 'Listo');
      this.getChallengeOrder();
    },
    error => {
      this.ngxLoader.stop();
      this.toastr.success('Ha ocurrido un error al cambiar el orden', 'Error');
    });
  }

}
