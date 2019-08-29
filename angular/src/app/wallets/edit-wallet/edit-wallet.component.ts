import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Wallet, Stock } from '../../models/wallet.model';
import { WalletService } from "../wallet.service";
import * as moment from 'moment';

@Component({
  templateUrl: './edit-wallet.component.html',
  styleUrls: ['./edit-wallet.component.scss']
})
export class EditWalletComponent implements OnInit {
  wallet: any;
  fg: FormGroup;
  stock_0_code; stock_0_weight; stock_1_code; stock_1_weight; stock_2_code; stock_2_weight; stock_3_code; stock_3_weight; stock_4_code; stock_4_weight; stock_5_code; stock_5_weight; stock_6_code; stock_6_weight; stock_7_code; stock_7_weight; stock_8_code; stock_8_weight; stock_9_code; stock_9_weight; stock_10_code; stock_10_weight; stock_11_code; stock_11_weight; stock_12_code; stock_12_weight; stock_13_code; stock_13_weight; stock_14_code; stock_14_weight;stock_15_code; stock_15_weight; stock_16_code; stock_16_weight;

  constructor(private route: ActivatedRoute, public service: WalletService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar) {
    this.fg = fb.group({
      group: ['', Validators.required],
      frequency: ['', Validators.required],
      type: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      stocks: fb.array([])
    });
  }

  ngOnInit() {
    this.wallet = this.route.snapshot.data.wallet;
    this.fillForm();
  }

  fillForm() {
    this.fg.controls.group.setValue(this.wallet.group);
    this.fg.controls.frequency.setValue(this.wallet.frequency);
    this.fg.controls.type.setValue(this.wallet.type);
    this.fg.controls.start.setValue(this.wallet.start);
    this.fg.controls.end.setValue(this.wallet.end);

    this.wallet.stocks.forEach((stock: Stock, index) => {
      this['stock_'+index+'_code'] = stock.code;
      this['stock_'+index+'_weight'] = stock.weight;
    });
  }

  buildWallet(): Wallet {
    let newWallet: Wallet = new Wallet();

    newWallet._id = this.wallet._id;
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

  onSubmit() {
    let newWallet = this.buildWallet();
    this.update(newWallet);
  }

  update(newWallet: Wallet) {
    this.service.update(newWallet).subscribe((res) => {
      this.snackBar.open('carteira atualizado com sucesso!', null, {duration: 2000});
      this.router.navigate([`/wallets`]);
    });
  }

  backToList() {
    this.router.navigate(['/wallets']);
  }
}
