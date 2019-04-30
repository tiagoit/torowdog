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

  constructor(private route: ActivatedRoute, private service: WalletService, private fb: FormBuilder, private router: Router, public snackBar: MatSnackBar) {
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
