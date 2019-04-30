import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TradeService } from './trade.service';
import { Trade } from 'app/models';

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss']
})
export class TradesComponent implements OnInit {
  trades: Trade[];

  constructor(private route: ActivatedRoute, private service: TradeService) { }

  ngOnInit() {
    this.service.getByCode(this.route.snapshot.paramMap.get('code')).subscribe((trades: Trade[]) => {
      this.trades = trades;
    });

  }

}
