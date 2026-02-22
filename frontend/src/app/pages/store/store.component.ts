import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService, WooProduct } from '../../services/products.service';

@Component({
  selector: 'um-store',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  products = signal<WooProduct[]>([]);
  loading = signal(true);
  error = signal(false);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getAll({ per_page: 20 }).subscribe({
      next: (data) => {
        this.products.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  getSizes(product: WooProduct): string[] {
    const attr = product.attributes.find(
      (a) => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size',
    );
    return attr?.options ?? [];
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }

  installment(price: string): string {
    const value = parseFloat(price) / 3;
    return value.toFixed(2).replace('.', ',');
  }
}
