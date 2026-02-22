import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ProductsService, WooProduct } from '../../services/products.service';

@Component({
  selector: 'um-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  products: WooProduct[] = [];
  loading = true;
  error = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.productsService
      .getAll({ per_page: 20 })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          this.products = Array.isArray(data) ? data : [];
        },
        error: () => {
          this.error = true;
        },
      });
  }

  getSizes(product: WooProduct): string[] {
    const attr = product.attributes.find(a => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size');
    return attr?.options ?? [];
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }
}
