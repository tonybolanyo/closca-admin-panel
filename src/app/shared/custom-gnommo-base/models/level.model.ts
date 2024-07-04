import { BaseModel } from "@gnommostudios/ng-gnommo-base";

export class Level extends BaseModel {

    // _id: string;                     
    code: string;
    name: string;
    description: string;
    status: string;
    badger: string; // Icono del nivel
	minRefills: number;
    maxRefills: number;
    refillReward: number;
    fountainCreationReward: number;
    totalUsers: number;

    constructor(_id, code) {
        super();
        this._id = _id
        this.code = code;
     }
}