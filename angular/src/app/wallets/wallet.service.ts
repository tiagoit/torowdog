import { Injectable, ModuleWithComponentFactories } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Wallet } from '../models/wallet.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService implements Resolve<Wallet>{
  url = `${environment.API_URL}/wallets`;

  getGroups() {
    return [
      'BB',
      'Bradesco',
      'BTG',
      'Coinval',
      'Elite',
      'Genial',
      'Guide',
      'Necton',
      'Planner',
      'Rico',
      'Santander',
      'Terra',
      'Toro',
      'XP'
    ];
  }

  getFrequencies() {
    return ['Semanal', 'Mensal'];
  }

  // Resolver for `/edit/:id` route.
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.getById(route.params.id);
  }

  constructor(private http: HttpClient) { }
  
  get() {
    return this.http.get(this.url);
  }
  
  getById(id: String) {
    return this.http.get(`${this.url}/${id}`);
  }
  
  update(data) {
    return this.http.put(`${this.url}/${data._id}`, data);
  }
  
  add(data) {
    return this.http.post(this.url, data);
  }
  
  delete(id: String) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
