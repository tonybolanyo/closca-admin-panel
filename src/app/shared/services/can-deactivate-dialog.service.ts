import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogConfirmationComponent } from '../components/dialog-confirmation/dialog-confirmation.component';

@Injectable()
export class CanDeactivateDialogService {

    constructor(
        private dialog: MatDialog,
        ) { }

    openDialog() {
        return Observable.create((observer: Observer<boolean>) => {
                const dialogRef = this.dialog.open(DialogConfirmationComponent, {
                    data: {
                        message: 'Hay cambios sin guardar, ¿Desea salir sin guardar los cambios de la página?'
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    observer.next(result);
                    observer.complete();
                }, (error) => {
                    observer.next(false);
                    observer.complete();
                });
            });
    }

}
