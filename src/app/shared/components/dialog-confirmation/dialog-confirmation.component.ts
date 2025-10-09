import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-confirmation',
    template: `
    <mat-dialog-content>
        <div class="content">{{data.message}}</div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="btn cancel-btn" mat-button mat-dialog-close (click)="onCloseReject()">No</button>
      <button class="btn confirm-btn" mat-button (click)="onCloseAccept()">Si</button>
    </mat-dialog-actions>
    `,
    styleUrls: ['./dialog-confirmation.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DialogConfirmationComponent implements OnInit {
    constructor( public dialogRef: MatDialogRef<DialogConfirmationComponent>,
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
