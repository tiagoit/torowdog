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
  stock_0_code; stock_0_weight; stock_1_code; stock_1_weight; stock_2_code; stock_2_weight; stock_3_code; stock_3_weight; stock_4_code; stock_4_weight; stock_5_code; stock_5_weight; stock_6_code; stock_6_weight; stock_7_code; stock_7_weight; stock_8_code; stock_8_weight; stock_9_code; stock_9_weight; stock_10_code; stock_10_weight; stock_11_code; stock_11_weight; stock_12_code; stock_12_weight; stock_13_code; stock_13_weight; stock_14_code; stock_14_weight;stock_15_code; stock_15_weight; stock_16_code; stock_16_weight;

  constructor(fb: FormBuilder, public service: WalletService, private router: Router, public snackBar: MatSnackBar) {
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
  
  backToList() {
    this.router.navigate(['/wallets']);
  }
}

