import { BaseModel } from "@gnommostudios/ng-gnommo-base";

export enum BrandStatus {
    'ACTIVE',
    'INACTIVE',
    'PENDING'
}

export class Brand extends BaseModel {
    name: string;
    imageId: string;
    fountains: Object;
    brandStatus: BrandStatus;
    brandLogo: string;

    constructor(_id, name) {
        super();
        this._id = _id
        this.name = name;
     }
}