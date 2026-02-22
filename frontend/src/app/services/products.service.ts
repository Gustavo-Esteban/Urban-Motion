import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WooProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  permalink: string;
  images: { src: string; alt: string }[];
  attributes: { name: string; options: string[] }[];
  short_description: string;
  description: string;
  stock_status: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(params?: { page?: number; per_page?: number }): Observable<WooProduct[]> {
    return this.http.get<WooProduct[]>(this.url, { params: params as any });
  }

  getOne(id: number): Observable<WooProduct> {
    return this.http.get<WooProduct>(`${this.url}/${id}`);
  }
}
