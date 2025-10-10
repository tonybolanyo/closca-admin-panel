import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-change-product-status',
  template: `
  <mat-dialog-content>
    <div class="content">{{data.message}}</div>
    <mat-form-field>
      <mat-select placeholder="Estado..." class="select" [formControl]="newProductStatus" required>
        <mat-option *ngFor="let option of options" [value]="option.value">
          {{option.name}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="btn cancel-btn" mat-button mat-dialog-close (click)="onCloseReject()">Cancelar</button>
    <button class="btn confirm-btn" mat-button (click)="onCloseAccept()">Confirmar</button>
  </mat-dialog-actions>
  `,
  styleUrls: ['./change-product-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeProductStatusComponent implements OnInit {
  newProductStatus = new UntypedFormControl('', [Validators.required]);
  options = [
    { name: 'Visible', value: 'VISIBLE' },
    { name: 'Invisible', value: 'INVISIBLE' },
    { name: 'Sin stock', value: 'OUT_OF_STOCK' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ChangeProductStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onCloseAccept() {
    this.dialogRef.close(this.newProductStatus.value);
  }

  onCloseReject() {
    this.dialogRef.close(false);
  }

}
