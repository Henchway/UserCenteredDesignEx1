import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {KindergardenDetailComponent} from "./dashboard/kindergarden-detail/kindergarden-detail.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: "full"},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'kindergardens/:id', component: KindergardenDetailComponent },
  { path: 'about', component: AboutPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
