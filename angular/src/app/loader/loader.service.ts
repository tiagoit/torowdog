import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  url = `${environment.API_URL}/loader`;

  constructor(private http: HttpClient) { }
  
  load(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const req = new HttpRequest('POST', this.url, formData);
    return this.http.request(req);
  }
  
  public upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const req = new HttpRequest('POST', this.url, formData);
    return this.http.request(req);
  }
}
