import { BaseModel } from '@gnommostudios/ng-gnommo-base';

export class Refill extends BaseModel {
    userId: string;
    fountainId: string;
    quantity: number;
    sharedQuantity: number;
    shared: boolean;
}
