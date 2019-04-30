import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  highlightedStock;

  constructor() { }

  highlightStock(stockCode) {
    this.highlightedStock = this.highlightedStock === stockCode ? undefined : stockCode;
  }

  isHighlighted(stockCode) {
    return this.highlightedStock === stockCode;
  }
}
