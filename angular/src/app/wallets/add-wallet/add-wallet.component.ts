import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WalletService } from '../wallet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Wallet, Stock } from '../../models/wallet.model';
import * as moment from 'moment';

@Component({
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss']
})
export class AddWalletComponent {
  fg: FormGroup;

  constructor(fb: FormBuilder, private service: WalletService, private router: Router, public snackBar: MatSnackBar) {
    this.fg = fb.group({
      group: ['', Validators.required],
      frequency: ['', Validators.required],
      type: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  buildWallet() {
    let newWallet: Wallet = new Wallet();
    newWallet.group = this.fg.controls.group.value;
    newWallet.frequency = this.fg.controls.frequency.value;
    newWallet.type = this.fg.controls.type.value;
    newWallet.start = this.fg.controls.start.value;
    newWallet.end = this.fg.controls.end.value;
    newWallet.code = newWallet.group + '-' + newWallet.type + '-' + moment(newWallet.start).format('ḾMDD');

    newWallet.stocks = [];
    for(let i=0; i<16; i++) {
      let code = this['stock_'+i+'_code'];
      if(code) {
        let s = new Stock();
        s.code = code;
        s.weight = this['stock_'+i+'_weight'];
        newWallet.stocks.push(s);
      }
    }
    newWallet.stocks = newWallet.stocks.sort((a, b) => a.code < b.code ? -1 : 1);
    return newWallet;
  }

  save() {
    this.service.add(this.buildWallet()).subscribe((res) => {
      this.snackBar.open('Wallet adicionada com sucesso!', null, {duration: 2000});
      this.router.navigate([`/wallets`]);
    });
  }
}

