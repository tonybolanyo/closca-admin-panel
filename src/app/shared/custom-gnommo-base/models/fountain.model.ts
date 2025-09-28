import { BaseModel } from '@tyris/angular-foundation-libs';
import { Corporate } from './corporate.model';

export enum FountainType {
    'PUBLIC',
    'RESTAURANT',
    'CAFE_BAR',
    'HOTEL_HOSTEL',
    'SHOP',
    'BANK',
    'OTHERS',
}

export enum RefillType {
    'COUNTER_SERVICE',
    'DRINKING_FOUNTAIN',
    'WATER_CONTAINER',
    'BOTTLE_REFILL'
}

export enum Features {
    'CHARGING_STATION',
    'HEALTHY_FOOD',
    'RECYCLING_CULTURE',
    'COMFY_SEATING',
    'FREE_WIFI',
    'GOOD_FOOD',
    'GOOD_MUSIC',
    'GOOD_VIBES',
    'PET_FRIENDLY',
    'RETAIL_SPACE',
    'READING_ZONE',
    'BOARD_GAMES',
    'AIR_CONDITIONED',
    'LIVE_MUSIC',
    'FITNESS_SPACE',
    'GREAT_PRICES',
    'SUNNY_PATIO',
    'WORKSPACE'
}

export class Loc {
    type: string;
    coordinates: number[];
}

export class GeoInfo {
    streetNumber: string;
    route: string;
    country: string;
    locality: string;
    administrativeAreaLevel1: string;
    administrativeAreaLevel2: string;
    administrativeAreaLevel3: string;
    administrativeAreaLevel4: string;
    postalCode: string;
}

export class Address {
    name: string;
    address: string;
    postalCode: string;
    town: string;
    province: string;
    country: string;
}

export enum WeekDayStart {
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
}

export enum WeekDayEnd {
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
}

export enum FountainStatus {
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'TEMP_CLOSED'
}

export class Fountain extends BaseModel {
    name: string;
    fountainType: FountainType;
    fountainStatus: FountainStatus;
    refillType: RefillType;
    geoInfo: GeoInfo;
    address: Address;
    imageId: string;
    openTime: number;
    closeTime: number;
    weekDayStart: WeekDayStart;
    weekDayEnd: WeekDayEnd;
    mapPinImageId: string;
    brandImageId: string;
    features: Features;
    loc: Loc;
    corporateInfo: Corporate;
    sharedAppleMaps: boolean;
    inactiveReason: MultiLanguageObject;
}

export class MultiLanguageObject {
    es: string;
    en: string;
}
