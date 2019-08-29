import { Component, OnInit } from '@angular/core';
import { TradeService } from '../../trades/trade.service';
import { Trade } from '../../models';
import * as moment from 'moment';
import { DashboardService } from '../dashboard.service';

class TableLine {
  code;
  qtt = 0;
  // hit = 0;
  // avgGain = undefined;
  qttBuy = 0;
  hitBuy = 0;
  avgGainBuy = undefined;
  qttSell = 0;
  hitSell = 0;
  avgGainSell = undefined;

  constructor(code) { this.code = code }
}

@Component({
  selector: 'toro-tables',
  templateUrl: './toro-tables.component.html',
  styleUrls: ['./toro-tables.component.scss']
})
export class ToroTablesComponent implements OnInit {
  trades: Trade[];
  dayTradeTable = new Object();
  orderedDayTradeArray: TableLine[] = [];

  curtoPrazoTable = new Object();
  orderedCurtoPrazoArray: TableLine[] = [];

  constructor(private tradeService: TradeService, private dashboardService: DashboardService) { }


  ngOnInit() {
    this.tradeService.get().subscribe(async (trades: Trade[]) => {
      this.trades = trades;
      this.dayTradeTable = await this.buildTable('DAY');
      this.orderedDayTradeArray = this.orderResults(this.dayTradeTable, 'DAY');

      this.curtoPrazoTable = await this.buildTable('CPR');
      this.orderedCurtoPrazoArray = this.orderResults(this.curtoPrazoTable, 'CPR');
    });
  }

  filterTrades(operationType, days) {
    return this.trades.filter(t => {
      return t.operationType === operationType && // Day trade only.
        moment().diff(moment(t.created), 'days') <= days && // Last X days only.
        !(t.code.includes('WDO') || t.code.includes('WIN')); // Remove Index and Dollar.
    })
  }

  buildTable(operationType) {
    let trades_;
    let table_ = new Object();
    let options = {
      'DAY': {
        days: 45,
        hitMinimum: 0.0015
      }, 'CPR': {
        days: 365,
        hitMinimum: 0.015
      }
    };

    trades_ = this.filterTrades(operationType, options[operationType].days);
    trades_ = trades_.forEach((trade: Trade) => {
      // Add stock to table
      if(!table_.hasOwnProperty(trade.code.toString())) {
        table_[trade.code.toString()] = new TableLine(trade.code);
      }
      table_[trade.code].qtt++;
      let gain = Math.abs((trade.price - trade.closePrice) * 100 / trade.price);

      // mininum of 0,15% to hit
      let buyHitMininum = (1 + options[operationType].hitMinimum); // 1.0015; 
      let sellHitMininum = (1 - options[operationType].hitMinimum); // 0.9985;

      // BUY
      if(trade.orderType === 'C') {
        table_[trade.code].qttBuy++;
        if(trade.price * buyHitMininum < trade.closePrice) {  
          table_[trade.code].hitBuy++;
          if(!table_[trade.code]['avgGainBuy']) {
            table_[trade.code]['avgGainBuy'] = gain;
          } else {
            let qtt = table_[trade.code].hitBuy;
            table_[trade.code]['avgGainBuy'] = (table_[trade.code]['avgGainBuy'] * (qtt - 1) + gain) / qtt;
          }
        }
      }

      // SELL
      else {
        table_[trade.code].qttSell++;
        if(trade.price * sellHitMininum > trade.closePrice) {
          table_[trade.code].hitSell++;
          if(!table_[trade.code]['avgGainSell']) {
            table_[trade.code]['avgGainSell'] = gain;
          } else {
            let qtt = table_[trade.code].hitSell;
            table_[trade.code]['avgGainSell'] = (table_[trade.code]['avgGainSell'] * (qtt - 1) + gain) / qtt;
          }
        }
      }
    });
    return table_;
  }

  orderResults(table, operationType) {
    let orderedArray: TableLine[] = [];
    // let minQtt = operationType === 'DAY' ? 2 : 2;
    // Object.keys(table).forEach((value, index) => {
    //   if(table[value].qtt >= minQtt) {
        // orderedArray.push(table[value])
    //   }
    // });
    Object.keys(table).forEach((value, index) => {
      orderedArray.push(table[value])
    });
    return orderedArray.sort((a, b) => (a.qtt < b.qtt) ? 1 : -1).slice(0, 25);
  }


  
}