import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

import { LoadComponent } from "./loader/load/load.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradesComponent } from './trades/trades.component';


const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'trades/:code', component: TradesComponent},
  { path: 'login', component: LoginComponent},
  { path: 'loader', component: LoadComponent, canActivate: [AuthGuard] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
