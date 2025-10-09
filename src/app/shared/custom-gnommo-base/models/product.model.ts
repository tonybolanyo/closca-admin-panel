import { BaseModel } from '@tyris/angular-foundation';

export enum ProductStatus {
    'VISIBLE',
    'INVISIBLE',
    'OUT_OF_STOCK'
}

export class Product extends BaseModel {
    name: string;
    description: string;
    typeId: string;
    imageId: string;
    descriptionImageId: string;
    discount: number;
    price: number;
    status: ProductStatus;
    stock: number;
    size: string[];
    totalRewardCodes: string;
    rewardCodes: string;
    rewardStepper: string;
}