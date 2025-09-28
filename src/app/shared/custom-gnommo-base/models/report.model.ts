import { BaseModel } from '@tyris/angular-foundation-libs';
import { Loc, Fountain, Address } from './fountain.model';

export enum ReportType {
    'FOUNTAIN_NOT_EXIST',
    'WATER_NOT_POTABLE',
    'INFORMATION_ERROR',
    'OTHERS'
}

export class Report extends BaseModel {
    reportType: ReportType;
    text: string;
    userId: string;
    fountainId: string;
    fountainInfo: Fountain;
    loc: Loc;
    address: Address;
    imageId: String;
}