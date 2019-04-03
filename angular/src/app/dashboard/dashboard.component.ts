import { Component, OnInit } from '@angular/core';
import { TradeService } from '../services/trade.service';
import { Trade } from '../models';


class TableLine {
  code;
  qtt = 0;
  hit = 0;
  qttBuy = 0;
  hitBuy = 0;
  qttSell = 0;
  hitSell = 0;

  constructor(code) { this.code = code }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  trades: Trade[];
  originalTradesArray: Trade[];
  tableData = new Object();
  orderedArray = [];

  constructor(private tradeService: TradeService) { }

  ngOnInit() {
    this.tradeService.get().subscribe((trades: Trade[]) => {
      this.trades = trades;
      this.originalTradesArray = trades;
      this.filterByContratosFuturos();
      this.buildTableData();
    });
  }

  buildTableData() {
    this.originalTradesArray.forEach((trade: Trade) => {
      if(!this.tableData.hasOwnProperty(trade.code.toString())) this.tableData[trade.code.toString()] = new TableLine(trade.code);
      this.tableData[trade.code].qtt++;

      if(trade.orderType === 'Buy') {  // BUY
        this.tableData[trade.code].qttBuy++;
        if(trade.price * 1.003 < trade.closePrice) {  // min 0,3% to hit
          this.tableData[trade.code].hitBuy++;
          this.tableData[trade.code].hit++;
        }
      }
      else {  // SELL
        this.tableData[trade.code].qttSell++;
        if(trade.price * 0.997> trade.closePrice) {  // min 0,3% to hit
          this.tableData[trade.code].hitSell++;
          this.tableData[trade.code].hit++;
        }
      }
    });
    this.orderResults()
  }

  orderResults() {
    Object.keys(this.tableData).forEach((value, index) => {
      this.orderedArray.push(this.tableData[value])
    });
    this.orderedArray = this.orderedArray.sort((a, b) => (a.qtt < b.qtt) ? 1 : -1);    
  }

  filterByContratosFuturos() { // WIN (Índice) ou WDO (Dólar)
    this.trades = this.originalTradesArray.filter(trade => {
      return trade.code.length == 6 && !trade.code.includes('WIN');
    });
  }

  count(code, orderType?) { // orderType=['Buy'|'Sell']
    return this.originalTradesArray && this.originalTradesArray.filter(trade => {
      if(orderType) {
        return trade.code.includes(code) && trade['orderType'] === orderType;
      } else {
        return trade.code.includes(code);
      }
    }).length;
  }

  
}
