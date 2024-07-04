import { BaseModel } from "@gnommostudios/ng-gnommo-base";

export class Onboarding extends BaseModel {
    title: string;
    description: string;
    image: string;
    imageInfo;
    icon: string;
    iconInfo;
}