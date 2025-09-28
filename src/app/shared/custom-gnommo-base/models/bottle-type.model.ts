import { BaseModel } from "@tyris/angular-foundation-libs";

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