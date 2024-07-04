import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MultiLanguageObject } from '../../custom-gnommo-base/models';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-change-fountain-status',
  template: `
  <mat-dialog-content>
    <div class="content">{{data.message}}</div>
    <form [formGroup]="fountainForm">
    <mat-form-field class="col-12">
      <mat-select placeholder="Estado..." class="select" formControlName="newFountainStatus" (selectionChange)="onFountainStatusChange($event.value)" required>
        <mat-option *ngFor="let option of options" [value]="option.value">
          {{option.name}}
        </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="col-12" *ngIf="fountainStatusSelected != undefined && fountainStatusSelected == 'INACTIVE'">
        <mat-select placeholder="Motivo de inactiva *" formControlName="inactiveReason">
          <mat-option *ngFor="let inactiveReason of inactiveReasons" [value]="inactiveReason">
            {{inactiveReason.es}}
          </mat-option>
        </mat-select>
    </mat-form-field>
    <mat-form-field class="col-12" *ngIf="fountainStatusSelected != undefined && fountainStatusSelected == 'TEMP_CLOSED'">
      <input matInput type="date" placeholder="Fecha reapertura" formControlName="reopenDate"/>
    </mat-form-field>
    </form>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="btn cancel-btn" mat-button mat-dialog-close (click)="onCloseReject()">Cancelar</button>
    <button class="btn confirm-btn" mat-button (click)="onCloseAccept()">Confirmar</button>
  </mat-dialog-actions>
  `,
  styleUrls: ['./change-fountain-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeFountainStatusComponent implements OnInit {
  fountainForm: FormGroup;
  options = [
    { name: 'Activa', value: 'ACTIVE' },
    { name: 'Inactiva', value: 'INACTIVE' },
    { name: 'Pendiente', value: 'PENDING' },
    { name: 'Cerrado Temporalmente', value: 'TEMP_CLOSED' }
  ];

  inactiveReasons: MultiLanguageObject[] = [
    {en: "Fuente Duplicada", es: "Fuente Duplicada"},
    {en: "Fuente Incorrecta - Defectos formales", es: "Fuente Incorrecta - Defectos formales"},
    {en: "Fuente Incorrecta - Ofensiva", es: "Fuente Incorrecta - Ofensiva"},
    {en: "Fuente Incorrecta - GRPD", es: "Fuente Incorrecta - GRPD"},
    {en: "Fuente Incorrecta - Publicidad", es: "Fuente Incorrecta - Publicidad"},
    {en: "Fuente Incorrecta - Imagen parcial", es: "Fuente Incorrecta - Imagen parcial"},
    {en: "Fuente con características no aceptada", es: "Fuente con características no aceptada"},
    {en: "Fuente privada (no acceso público)", es: "Fuente privada (no acceso público)"},
    {en: "Fuente no existe", es: "Fuente no existe"}
  ];

  fountainStatusSelected;

  constructor(
    public dialogRef: MatDialogRef<ChangeFountainStatusComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.fountainForm = this.formBuilder.group({
      inactiveReason: [{ value: null, disabled: false }],
      newFountainStatus: [{ value: '', disabled: false }],
      reopenDate: [{ value: null, disabled: false }]
    });
  }

  onCloseAccept() {
    if (this.fountainForm.value.newFountainStatus == "INACTIVE" && this.fountainForm.value.inactiveReason == null) {
      this.toastr.error('Debes seleccionar un motivo de inactiva', 'Error');
      return;
    } else if (this.fountainForm.value.newFountainStatus != "INACTIVE") {
      this.fountainForm.value.inactiveReason = null;

      if (this.fountainForm.value.newFountainStatus == "TEMP_CLOSED") {
        let newTimestamp = (new Date(this.fountainForm.value.reopenDate)).getTime()
  
        if (newTimestamp <= (new Date()).getTime()) {
          this.toastr.error('La fecha de reapertura no puede ser menor a la actual', 'Error');
          return;
        }
        
        this.fountainForm.value.reopenDate = (new Date(this.fountainForm.value.reopenDate)).getTime();
      }
    }

    this.dialogRef.close(this.fountainForm.value);
  }

  onCloseReject() {
    this.dialogRef.close(false);
  }

  onFountainStatusChange(value) {
    this.fountainStatusSelected = value;

    if (this.fountainStatusSelected == "TEMP_CLOSED") {
      let date = new Date((new Date()).getTime() + 7776000000)
      this.fountainForm.get('reopenDate').setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
    }
  }

}
