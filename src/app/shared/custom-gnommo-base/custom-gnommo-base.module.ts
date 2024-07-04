import { NgModule } from '@angular/core';
import {
    UserService,
    RefillService,
    HydrationRefillService,
    ChallengeService,
    BrandService,
    FountainService,
    ReportService,
    ChallengeSubscriptionService,
    ProductService,
    ProductTypesService,
    RewardService,
    UserRatingsService,
    ImagesRandomService,
    CorporateService,
    OnboardingService,
    BottleService,
    BottleTypesService,
    LevelService
} from './services';


@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        UserService,
        FountainService,
        BrandService,
        ReportService,
        RefillService,
        HydrationRefillService,
        ChallengeService,
        ChallengeSubscriptionService,
        ProductService,
        ProductTypesService,
        RewardService,
        UserRatingsService,
        ImagesRandomService,
        CorporateService,
        OnboardingService,
        BottleService,
        BottleTypesService,
        LevelService
    ],
})
export class CustomGnommoBaseModule { }
