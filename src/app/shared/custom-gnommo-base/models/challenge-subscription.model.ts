import { BaseModel } from '@gnommostudios/ng-gnommo-base';

export enum ChallengeStatus {
    'SUSCRIBED',
    'UNSUSCRIBED',
    'DONE',
    'FAILED'
}



export class ChallengeSubscription extends BaseModel {
    // userId: string;
    // challengeId: string;
    challengeStatus: string;
    totalRefilled: number;
    totalHydrationRefilled: number;
    fountainsCreated: number;
    fountainsRated: number;
}
