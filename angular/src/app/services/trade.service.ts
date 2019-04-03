import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trade } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  url = `${environment.API_URL}/trades`;

  constructor(private http: HttpClient) { }
      
  get() {
    return this.http.get(this.url);
  }
  
  getById(id) {
    return this.http.get(`${this.url}/${id}`);
  }
  
  update(data) {
    return this.http.put(`${this.url}/${data._id}`, data);
  }
  
  add(data) {
    return this.http.post(this.url, data);
  }
  
  delete(id) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
