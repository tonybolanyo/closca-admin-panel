import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  standalone: true,
    selector: 'app-cookies',
    styleUrls: ['./cookies.component.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
    <div class="w-100 text-center">
    <p>Utilizamos cookies propias y de
    terceros para obtener datos estadísticos de
    la navegación de nuestros usuarios y mejorar
    nuestros servicios. <br/>Si acepta o continúa navegando,
    consideramos que acepta su uso.
    </p>
    <button class="btn btn-primary" (click)="acceptCookies()">Aceptar y continuar</button>
    </div>
    `,
    imports: []
})

export class CookiesComponent implements OnInit {
    constructor(public bottomSheetRef: MatBottomSheetRef<CookiesComponent>) { }

    ngOnInit() { }

    acceptCookies() {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

}
