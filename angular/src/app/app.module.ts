import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { HotkeyModule } from 'angular2-hotkeys';
import { JwtModule } from '@auth0/angular-jwt';

import { NavComponent } from './angular-material-components/nav/nav.component';
import { AngularMaterialComponentsModule } from './angular-material-components/angular-material-components.module';
import { AppComponent } from './app.component';

import { DialogConfirm } from './angular-material-components/dialog-confirm.component';

import { LoadComponent } from './loader/load/load.component';

import { LoginComponent } from './auth/login/login.component';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradesComponent } from './trades/trades.component';

import { ListWalletsComponent } from './wallets/list-wallets/list-wallets.component';
import { AddWalletComponent } from './wallets/add-wallet/add-wallet.component';
import { EditWalletComponent } from './wallets/edit-wallet/edit-wallet.component';

import { ToroTablesComponent } from "./dashboard/toro-tables/toro-tables.component";
import { WalletsListComponent } from './dashboard/wallets-list/wallets-list.component';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoadComponent,
    DialogConfirm,
    LoginComponent,
    DashboardComponent,
    ToroTablesComponent,
    TradesComponent,
    ListWalletsComponent, AddWalletComponent, EditWalletComponent, WalletsListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule, ReactiveFormsModule,
    HotkeyModule.forRoot(),
    AngularMaterialComponentsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200', 'localhost:8080', 'torowdog.appspot.com', ''],
        blacklistedRoutes: ['localhost:4200/api/auth', 'localhost:8080/api/auth', 'torowdog.appspot.com/api/auth']
      }
    })
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogConfirm]
})
export class AppModule { }
