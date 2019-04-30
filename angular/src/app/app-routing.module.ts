import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

import { LoadComponent } from "./loader/load/load.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradesComponent } from './trades/trades.component';

import { ListWalletsComponent } from './wallets/list-wallets/list-wallets.component';
import { AddWalletComponent } from './wallets/add-wallet/add-wallet.component';
import { EditWalletComponent } from './wallets/edit-wallet/edit-wallet.component';
import { WalletService } from "./wallets/wallet.service";

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'trades/:code', component: TradesComponent},
  { path: 'login', component: LoginComponent},

  { path: 'wallets', component: ListWalletsComponent, canActivate: [AuthGuard] },
  { path: 'wallets/add', component: AddWalletComponent, canActivate: [AuthGuard] },
  { path: 'wallets/edit/:id', component: EditWalletComponent, canActivate: [AuthGuard], resolve: { wallet: WalletService } },

  { path: 'loader', component: LoadComponent, canActivate: [AuthGuard] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
