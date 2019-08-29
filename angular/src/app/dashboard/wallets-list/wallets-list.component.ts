import { Component, OnInit } from '@angular/core';
import { WalletService } from "../../wallets/wallet.service";
import { Wallet } from 'app/models/wallet.model';
import * as moment from 'moment';
import { DashboardService } from '../dashboard.service';

class SummaryTableItem {
  stockCode: string;
  count: number;

  constructor(stockCode) {
    this.stockCode = stockCode;
    this.count = 0;
  }
}

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.scss']
})
export class WalletsListComponent implements OnInit {
  wallets: Wallet[];
  summaryTable: SummaryTableItem[];

  constructor(private service: WalletService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.service.get().subscribe(wallets => {
      this.wallets = (<Wallet[]> wallets).filter(w => {
        let walletMonth = parseInt(moment(w.start).format("MM"));
        let currentMonth = parseInt(moment().format("MM"));
        return walletMonth === currentMonth || walletMonth === (currentMonth - 1);
      });
      this.orderWallets();
      this.buildSummaryTable();
    });
  }

  orderWallets() {
    this.wallets = this.wallets.sort((a, b) => {
      return a.group.concat(a.type) < b.group.concat(b.type) ? -1 : 1;
    });
  }

  isWalletActive(wallet: Wallet) {
    if(wallet.frequency === 'Mensal') {
      return moment(wallet.start).month() == moment().month();
    } else {
      return moment(wallet.start).week() == moment().week();;
    }
  }

  async buildSummaryTable() {
    this.summaryTable = [];
    await this.wallets.forEach(w => {
      w.stocks.forEach(s => {
        if(this.isWalletActive(w)) {
          let item: SummaryTableItem = this.summaryTable.find(it => it.stockCode === s.code);
          if(!item) {
            item = new SummaryTableItem(s.code);
            this.summaryTable.push(item);
          }
          item.count++;
        }
      });
    });
    this.summaryTable = this.summaryTable.sort((a, b) => {
      return a.count > b.count ? -1 : 1;
    }).slice(0, 30);
  }
}
