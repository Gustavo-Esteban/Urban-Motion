import { Component, OnInit } from '@angular/core';
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
  products: WooProduct[] = [];
  loading = true;
  error = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getAll({ per_page: 20 }).subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
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
}
