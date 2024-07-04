import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RandomFountainImagesComponent } from './containers/random-fountain-images/random-fountain-images.component';

const routes: Routes = [
    {
        path: '',
        component: RandomFountainImagesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RandomFountainImagesRoutingModule {

}
