import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService, WooProduct } from '../../services/products.service';

@Component({
  selector: 'um-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  highlights = signal<WooProduct[]>([]);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getAll({ per_page: 3 }).subscribe({
      next: (data) => this.highlights.set(Array.isArray(data) ? data.slice(0, 3) : []),
      error: () => {},
    });
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }

  installment(price: string): string {
    const value = parseFloat(price) / 3;
    return value.toFixed(2).replace('.', ',');
  }
}
