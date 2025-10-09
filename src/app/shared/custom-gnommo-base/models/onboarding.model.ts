import { BaseModel } from "@tyris/angular-foundation";

export class Onboarding extends BaseModel {
    title: string;
    description: string;
    image: string;
    imageInfo;
    icon: string;
    iconInfo;
}