import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTable, MatSnackBar } from '@angular/material';
import { ListWalletsDataSource } from './list-wallets-datasource';
import { WalletService } from '../wallet.service';
import { Router } from '@angular/router';
import { Wallet } from "../../models/wallet.model";
import { DialogConfirm } from '../../angular-material-components/dialog-confirm.component';

@Component({
  selector: 'app-list-wallets',
  templateUrl: './list-wallets.component.html',
  styleUrls: ['./list-wallets.component.scss'],
})
export class ListWalletsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: ListWalletsDataSource;
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['start', 'group', 'type', 'stocks', 'actions'];

  constructor(private service: WalletService, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() { this.get() }

  get(afterDelete?: Boolean) {
    this.service.get().subscribe((data: Wallet[]) => {
      this.dataSource = new ListWalletsDataSource(this.paginator, this.sort, data);
      if(afterDelete) {
        this.snackBar.open('Carteira removida.', null, {duration: 2000});
      } else {
      }
    });
  }

  edit(id: String) { 
    this.router.navigate([`/wallets/edit/${id}`])
  }
  add() { this.router.navigate(['/wallets/add'])}

  delete(id: String, title: String) {
    const dialogRef = this.dialog.open(DialogConfirm, {width: '320px', data: {title: title}});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.service.delete(id).subscribe(() => this.get(true));
      }
    });
  }

  joinStocks(stocks) {
    return stocks.map(s => s.code).join(', ')
  }

  // filter(s: string) {
  //   this.dataSource.filter = s.trim().toLowerCase();
  // }

}