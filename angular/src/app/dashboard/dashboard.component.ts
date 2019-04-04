import { Component, OnInit } from '@angular/core';
import { TradeService } from '../trades/trade.service';
import { Trade } from '../models';
import * as moment from 'moment';

class TableLine {
  code;
  qtt = 0;
  hit = 0;
  avgGain = undefined;
  qttBuy = 0;
  hitBuy = 0;
  avgGainOnBuy = undefined;
  qttSell = 0;
  hitSell = 0;
  avgGainOnSell = undefined;

  constructor(code) { this.code = code }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trades: Trade[];
  tableData = new Object();
  orderedArray: TableLine[] = [];

  constructor(private tradeService: TradeService) { }

  ngOnInit() {
    this.tradeService.get().subscribe((trades: Trade[]) => {
      this.trades = trades.filter(trade => {
        return moment().diff(moment(trade.created), 'days') <= 30;    // only last 30 days
      });
      this.buildTableData();
    });
  }

  buildTableData() {
    this.trades.forEach((trade: Trade) => {
      if(!this.tableData.hasOwnProperty(trade.code.toString())) this.tableData[trade.code.toString()] = new TableLine(trade.code);
      this.tableData[trade.code].qtt++;
      let gain = Math.abs((trade.price - trade.closePrice) * 100 / trade.price);

      if(trade.orderType === 'Buy') {  // BUY
        this.tableData[trade.code].qttBuy++;
        if(trade.price * 1.0015 < trade.closePrice) {  // min 0,15% to hit
          this.tableData[trade.code].hitBuy++;
          this.tableData[trade.code].hit++;
          if(!this.tableData[trade.code]['avgGain']) {
            this.tableData[trade.code]['avgGain'] = gain;
            console.log('ok')
          } else {
            let qtt = this.tableData[trade.code].hit;
            this.tableData[trade.code]['avgGain'] = (this.tableData[trade.code]['avgGain'] * (qtt - 1) + gain) / qtt;
          }
        }
      }
      else {  // SELL
        this.tableData[trade.code].qttSell++;
        if(trade.price * 0.9985 > trade.closePrice) {  // min 0,15% to hit
          this.tableData[trade.code].hitSell++;
          this.tableData[trade.code].hit++;

          if(!this.tableData[trade.code]['avgGain']) {
            this.tableData[trade.code]['avgGain'] = gain;
          } else {
            let qtt = this.tableData[trade.code].hit;
            this.tableData[trade.code]['avgGain'] = (this.tableData[trade.code]['avgGain'] * (qtt - 1) + gain) / qtt;
          }
        }
      }
    });
    this.orderResults();
  }

  orderResults() {
    Object.keys(this.tableData).forEach((value, index) => {
      if(this.tableData[value].qtt > 5) {
        this.orderedArray.push(this.tableData[value])
      }
    });
    this.orderedArray = this.orderedArray.sort((a, b) => (a.qtt < b.qtt) ? 1 : -1);    
  }

  // filterByContratosFuturos() { // WIN (Índice) ou WDO (Dólar)
  //   this.trades = this.trades.filter(trade => {
  //     return trade.code.length == 6 && !trade.code.includes('WIN');
  //   });
  // }

  // count(code, orderType?) { // orderType=['Buy'|'Sell']
  //   return this.trades && this.trades.filter(trade => {
  //     if(orderType) {
  //       return trade.code.includes(code) && trade['orderType'] === orderType;
  //     } else {
  //       return trade.code.includes(code);
  //     }
  //   }).length;
  // }

  
}
