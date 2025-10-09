import { BaseModel } from "@tyris/angular-foundation";

export class Corporate extends BaseModel {
    code: string;
    name: string;
    description: string;
    logotype: string;
    beaconMajor: number;

    constructor(_id, name) {
        super();
        this._id = _id
        this.name = name;
    }
}