import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.base_url;
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();
  constructor(private http: HttpClient) {}

  updateSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}products/categories`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}products/category/${category}`);
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}products/search?q=${query}`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}products`);
  }
}
