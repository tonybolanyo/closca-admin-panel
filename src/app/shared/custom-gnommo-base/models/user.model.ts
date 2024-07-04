// import { BaseModel } from '@gnommostudios/ng-gnommo-base';
import { Fountain } from './fountain.model';

export class User {
    _id?: string;
    userName?: string;
    realName?: string;
    corporateCode?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    emailVerfied?: boolean;
    role?: string;
    isAdmin?: boolean;
    fountains?: Fountain;
    avatarId?: string;
    closcaPoints?: number;
    totalRefills?: number;
    instance?: any;
}
