import { BaseModel } from '@tyris/angular-foundation';

export class Refill extends BaseModel {
    userId: string;
    fountainId: string;
    quantity: number;
    sharedQuantity: number;
    shared: boolean;
}
