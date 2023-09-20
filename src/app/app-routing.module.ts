import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './page/payment/card/card.component';
import { HomeComponent } from './payment/home/home.component';

const routes: Routes = [
{
  path:'payment',
  component: HomeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
