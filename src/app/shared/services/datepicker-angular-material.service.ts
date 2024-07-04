import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {

    // format(date: Date, displayFormat: Object): string {

    //     if (displayFormat === 'input') {

    //         const day = date.getDate();
    //         const month = date.getMonth() + 1;
    //         const year = date.getFullYear();

    //         return `${day}-${month}-${year}`;
    //     }

    //     return date.toDateString();
    // }
    format(date: Date, displayFormat: Object): string {
        return date.toLocaleDateString(('es-ES'));
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }

    getFirstDayOfWeek(): number {
        return 1;
    }
}
