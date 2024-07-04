import { BaseModel } from "@gnommostudios/ng-gnommo-base";

export class BottleType extends BaseModel {

    name: string;
    color: string;
    image: string;
    imageInfo;

    constructor(_id, name) {
        super();
        this._id = _id
        this.name = name;
     }
}