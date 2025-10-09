import { BaseModel } from '@tyris/angular-foundation';

export class Challenge extends BaseModel {
    level?: number;
    type: any;
    fountains: string[];
    backgroundId: string;
    imageId: string;
    fillsNeeded: number;
    fountainsCreatedNeeded: number;
    fountainsRatedNeeded: number;
    hydrationFillsNeeded: number;
    startDate: number;
    endDate: number;
    name: string;
    brandId?: string;
    description?: string;
    closcaPoints: number;


    backgroundInfo?: any;
    imageInfo?: any;
    brandInfo?: any;

    private?: boolean;
}
