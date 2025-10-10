import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dialog-info',
    styleUrls: ['./dialog-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <mat-dialog-content>
    <div class="content">
    <h4>Localización</h4>
    <p>Calle: {{data.address}}</p>
    <div>Coordenadas:</div>
    <div>LAT:  {{data.lat}}</div>
    <div>LON:  {{data.lng}}</div>
    </div>
    </mat-dialog-content>
    <mat-dialog-actions class="mat-dialog-info-actions">
        <button class="btn cancel-btn" mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
    `

})

export class DialogInfoComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<DialogConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() { }

}
