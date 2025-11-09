import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor() {}

  // Simulated GET request
  get<T>(url: string, data?: any): Observable<T> {
    console.log(`GET called for: ${url}`, data);
    return of(data as T);
  }

  // Simulated POST request
  post<T>(url: string, body: any): Observable<T> {
    console.log(`POST called for: ${url}`, body);
    return of(body as T);
  }

  // Simulated PUT request
  put<T>(url: string, body: any): Observable<T> {
    console.log(`PUT called for: ${url}`, body);
    return of(body as T);
  }

  // Simulated DELETE request
  delete<T>(url: string): Observable<T> {
    console.log(`DELETE called for: ${url}`);
    return of({} as T);
  }
}