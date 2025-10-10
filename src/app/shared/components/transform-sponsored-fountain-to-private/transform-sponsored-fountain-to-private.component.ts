import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-transform-sponsored-fountain-to-private',
  template: `
  <mat-dialog-content>
    <div class="content">{{data.message}}</div>
    <div class="confirmation">{{data.confirmation}}</div>
    <mat-form-field>
      <mat-select placeholder="Selecciona un tipo de fuente..." class="select" [formControl]="newFountainType" required>
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
  styleUrls: ['./transform-sponsored-fountain-to-private.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransformSponsoredFountainToPrivateComponent implements OnInit {
  newFountainType = new UntypedFormControl('', [Validators.required]);
  options = [
    { name: 'Restaurante', value: 'RESTAURANT' },
    { name: 'Cafe bar', value: 'CAFE_BAR' },
    { name: 'Hotel / Hostal', value: 'HOTEL_HOSTEL' },
    { name: 'Tienda', value: 'SHOP' },
    { name: 'Banco', value: 'BANK' },
    { name: 'Otro', value: 'OTHERS' }
  ];

  constructor(
    public dialogRef: MatDialogRef<TransformSponsoredFountainToPrivateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onCloseAccept() {
    this.dialogRef.close(this.newFountainType.value);
  }

  onCloseReject() {
    this.dialogRef.close(false);
  }

}
