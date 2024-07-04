import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-challenge-csv-response-dialog',
  template: `
  <h2 mat-dialog-title>
    {{data.title}}
  </h2>
  <mat-dialog-content>
    <p [innerHTML]="data.message"></p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="btn confirm-btn" mat-button (click)="onCloseAccept()">Aceptar</button>
  </mat-dialog-actions>
  `,
  styleUrls: ['./challenge-csv-response-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChallengeCsvResponseDialogComponent implements OnInit {
  constructor( public dialogRef: MatDialogRef<ChallengeCsvResponseDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onCloseAccept() {
      this.dialogRef.close(true);
  }

  onCloseReject() {
      this.dialogRef.close(false);
  }
}
